import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { createInvoiceHash } from '../utils/aleo-utils';

export type PaymentStep = 'CONNECT' | 'VERIFY' | 'CONVERT' | 'PAY' | 'SUCCESS';

export const usePayment = () => {
    const [searchParams] = useSearchParams();
    const { publicKey, requestTransaction, requestRecords } = useWallet();

    // parsed params
    const [invoice, setInvoice] = useState<{
        merchant: string;
        amount: number;
        salt: string;
        hash: string;
        memo: string;
    } | null>(null);

    const [status, setStatus] = useState<string>('Initializing...');
    const [step, setStep] = useState<PaymentStep>('CONNECT');
    const [loading, setLoading] = useState(false);
    const [txId, setTxId] = useState<string | null>(null);
    const [conversionTxId, setConversionTxId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize & Verify
    useEffect(() => {
        const init = async () => {
            const merchant = searchParams.get('merchant');
            const amount = searchParams.get('amount');
            const salt = searchParams.get('salt');
            const hash = searchParams.get('hash');
            const memo = searchParams.get('memo') || '';

            if (!merchant || !amount || !salt || !hash) {
                setError('Invalid Invoice Link: Missing parameters');
                return;
            }

            try {
                setLoading(true);
                // Verify Hash
                const calculatedHash = await createInvoiceHash(merchant, Number(amount), salt);

                if (calculatedHash !== hash) {
                    setError('Security Warning: Invoice Hash Mismatch! The link may be tampered.');
                    return;
                }

                setInvoice({
                    merchant,
                    amount: Number(amount),
                    salt,
                    hash,
                    memo
                });

                if (publicKey) {
                    setStep('VERIFY');
                } else {
                    setStep('CONNECT');
                }

            } catch (err) {
                console.error(err);
                setError('Failed to verify invoice integrity.');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [searchParams, publicKey]);

    // Check Balance / Records (Simple Heuristic for now)
    const checkPrivateBalance = async () => {
        if (!publicKey || !requestRecords || !invoice) return false;

        try {
            setStatus('Checking private records...');
            // Request credits.aleo records
            const records = await requestRecords('credits.aleo');
            // Filter for unspent records that are > invoice.amount
            // Note: This is a basic check. Real wallets manage this, but we want to help the user.
            const suitableRecord = records.find(r => !r.spent && getMicrocredits(r.data) >= invoice.amount);

            return !!suitableRecord;
        } catch (e) {
            console.warn("Failed to check records, assuming user might verify manually", e);
            return false;
        }
    };

    const getMicrocredits = (recordData: any): number => {
        // Parse "1000000u64" -> 1000000
        try {
            // Often data is { microcredits: "100u64", ... } or just string text
            // This parsing depends on how the wallet returns data.
            // For now, let's look for microcredits field.
            if (recordData.microcredits) {
                return parseInt(recordData.microcredits.replace('u64', ''));
            }
            return 0;
        } catch {
            return 0;
        }
    };

    const convertPublicToPrivate = async () => {
        if (!invoice || !publicKey || !requestTransaction) return;

        try {
            setLoading(true);
            setStatus('Converting Public Credits to Private...');
            const bufferAmount = invoice.amount + 0.01;
            const amountMicro = Math.round(bufferAmount * 1_000_000);

            const transaction = {
                address: publicKey,
                chainId: WalletAdapterNetwork.TestnetBeta,
                transitions: [{
                    program: 'credits.aleo',
                    functionName: 'transfer_public_to_private',
                    inputs: [publicKey, `${amountMicro}u64`]
                }],
                fee: 100_000,
                feePrivate: false
            };

            const txId = await requestTransaction(transaction);
            setConversionTxId(txId);
            setStatus(`Converting ${bufferAmount} credits (${invoice.amount} + 0.01 buffer). TxID: ${txId.slice(0, 10)}...`);
            setLoading(false);

        } catch (e: any) {
            setError(e.message);
            setLoading(false);
        }
    };

    const payInvoice = async () => {
        if (!invoice || !publicKey || !requestTransaction || !requestRecords) return;

        try {
            setLoading(true);
            setStatus('Searching for suitable private record...');

            const records = await requestRecords('credits.aleo');
            const amountMicro = Math.round(invoice.amount * 1_000_000);

            const payRecord = records.find(r => {
                const val = getMicrocredits(r.data);
                // Strict greater than logic
                return !r.spent && val > amountMicro;
            });

            if (!payRecord) {
                // Check if we have an EXACT match (which is likely why it failed previously)
                const exactMatch = records.find(r => !r.spent && getMicrocredits(r.data) === amountMicro);

                setStep('CONVERT');
                if (exactMatch) {
                    setStatus(`You have exactly ${invoice.amount} credits. Converting will automatically add 0.01 buffer to create a valid change output.`);
                } else {
                    // Check for fragmentation
                    const totalBalance = records.reduce((sum, r) => sum + getMicrocredits(r.data), 0);
                    const maxRecord = Math.max(...records.map(r => getMicrocredits(r.data)));

                    if (totalBalance >= amountMicro) {
                        setStatus(`Fragmented Balance: Total ${totalBalance / 1_000_000} credits, but largest coin is ${maxRecord / 1_000_000}. Converting ${invoice.amount + 0.01} will create one unified coin.`);
                    } else {
                        setStatus(`Insufficient balance. Converting ${invoice.amount + 0.01} credits to private...`);
                    }
                }
                setLoading(false);
                return;
            }

            console.log("Selected Pay Record:", payRecord);

            // Construct valid record input
            // 1. Prefer plaintext if available
            // 2. Reconstruct from data/nonce if available
            // 3. Fallback to ciphertext (might fail for private transitions if wallet needs plaintext)
            let recordInput = payRecord.plaintext;

            if (!recordInput) {
                console.warn("Record missing plaintext. Attempting to reconstruct...");
                // Check if we have nonce
                // @ts-ignore
                const nonce = payRecord.nonce || payRecord._nonce || payRecord.data?._nonce;

                if (nonce) {
                    const microcredits = getMicrocredits(payRecord.data);
                    const owner = payRecord.owner;
                    // Reconstruction format: "{ owner: ..., microcredits: ...u64.private, _nonce: ...group.public }"
                    recordInput = `{ owner: ${owner}.private, microcredits: ${microcredits}u64.private, _nonce: ${nonce}.public }`;
                    console.log("Reconstructed Plaintext:", recordInput);
                } else if (payRecord.ciphertext) {
                    console.log("Found Ciphertext. Using it as input.");
                    recordInput = payRecord.ciphertext;
                } else {
                    console.warn("Could not find nonce AND missing ciphertext. Dumping Record Keys:", Object.keys(payRecord));
                    if (payRecord.data) console.log("Record Data Keys:", Object.keys(payRecord.data));

                    // Warn user instead of passing object which definitely fails
                    setStatus("Error: Wallet permission denied. Please enable 'Record Plaintext' access.");
                    setLoading(false);
                    return;
                }
            }

            setStatus('Requesting Payment Signature...');

            const inputs = [
                recordInput,
                invoice.merchant,
                `${amountMicro}u64`,
                invoice.salt,
                invoice.hash
            ];
            console.log("Transaction Inputs:", inputs);

            const transaction = {
                address: publicKey,
                chainId: WalletAdapterNetwork.TestnetBeta,
                transitions: [{
                    program: 'zk_pay_proofs_privacy_v3.aleo', // Ensure v3
                    functionName: 'pay_invoice',
                    inputs: inputs
                }],
                fee: 100_000,
                feePrivate: false
            };

            const tx = await requestTransaction(transaction);
            setTxId(tx);
            try {
                setStatus('Submitting payment proof to backend...');
                const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                await fetch(`${backendUrl}/sync-event`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        invoice_hash: invoice.hash,
                        status: 'SETTLED',
                        block_height: 0,
                        transaction_id: tx,
                        merchant: invoice.merchant,
                        amount: invoice.amount,
                        memo: invoice.memo
                    })
                });
                console.log("✅ Proof/TX submitted to backend");
            } catch (err) {
                console.error("Failed to sync with backend:", err);
            }

            setStep('SUCCESS');
            setStatus('Payment Successful!');

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Payment Failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        status,
        loading,
        error,
        invoice,
        txId,
        conversionTxId,
        publicKey,
        payInvoice,
        convertPublicToPrivate
    };
};

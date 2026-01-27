import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { TransactionOptions } from '@provablehq/aleo-types';
import { getInvoiceHashFromMapping, getInvoiceStatus } from '../utils/aleo-utils';

export type PaymentStep = 'CONNECT' | 'VERIFY' | 'CONVERT' | 'PAY' | 'SUCCESS' | 'ALREADY_PAID';

export const usePayment = () => {
    const [searchParams] = useSearchParams();
    const { address, wallet, executeTransaction, requestRecords, decrypt } = useWallet();
    const publicKey = address;
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

    useEffect(() => {
        const init = async () => {
            const merchant = searchParams.get('merchant');
            const amount = searchParams.get('amount');
            const salt = searchParams.get('salt');
            const memo = searchParams.get('memo') || '';

            if (!merchant || !amount || !salt) {
                setError('Invalid Invoice Link: Missing parameters');
                return;
            }

            try {
                setLoading(true);
                setStatus('Verifying Invoice on-chain...');

                // Fetch Hash from Chain using Salt
                const fetchedHash = await getInvoiceHashFromMapping(salt);

                if (!fetchedHash) {
                    setError('Invoice not found or invalid salt. Ask merchant for correct link.');
                    setLoading(false);
                    return;
                }

                // Check Status
                const invoiceStatus = await getInvoiceStatus(fetchedHash);
                if (invoiceStatus === 1) {
                    setInvoice({
                        merchant,
                        amount: Number(amount),
                        salt,
                        hash: fetchedHash,
                        memo
                    });
                    setStep('ALREADY_PAID');
                    setLoading(false);
                    return;
                }

                setInvoice({
                    merchant,
                    amount: Number(amount),
                    salt,
                    hash: fetchedHash,
                    memo
                });

                setStatus(''); // Clear status after verification
                if (publicKey) {
                    setStep('PAY');
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

        if (!invoice) {
            init();
        }
    }, [searchParams, publicKey]);



    const getMicrocredits = (record: any): number => {
        try {
            if (record.data && record.data.microcredits) {
                return parseInt(record.data.microcredits.replace('u64', ''));
            }
            if (record.plaintext) {
                const match = record.plaintext.match(/microcredits:\s*([\d_]+)u64/);
                if (match && match[1]) {
                    return parseInt(match[1].replace(/_/g, ''));
                }
            }
            return 0;
        } catch {
            return 0;
        }
    };

    const convertPublicToPrivate = async () => {
        if (!invoice || !publicKey || !executeTransaction) return;

        try {
            setLoading(true);
            setStatus('Converting Public Credits to Private...');
            const bufferAmount = invoice.amount + 0.01;
            const amountMicro = Math.round(bufferAmount * 1_000_000);

            const transaction: TransactionOptions = {
                program: 'credits.aleo',
                function: 'transfer_public_to_private',
                inputs: [publicKey, `${amountMicro}u64`],
                fee: 100_000
            };

            const result = await executeTransaction(transaction);

            if (result && result.transactionId) {
                setConversionTxId(result.transactionId);
                setStatus(`Converting... TxID: ${result.transactionId.slice(0, 10)}... Polling for confirmation...`);

                if (!wallet || !wallet.adapter) {
                    await new Promise(r => setTimeout(r, 2000));
                    setStep('PAY');
                    return;
                }

                let isPending = true;
                let attempts = 0;
                while (isPending && attempts < 120) {
                    attempts++;
                    await new Promise(r => setTimeout(r, 1000));
                    try {
                        const statusRes = await wallet.adapter.transactionStatus(result.transactionId);
                        const statusStr = typeof statusRes === 'string'
                            ? (statusRes as string).toLowerCase()
                            : (statusRes as any)?.status?.toLowerCase();

                        // Check for final on-chain ID
                        if ((statusRes as any)?.transactionId) {
                            const finalId = (statusRes as any).transactionId;
                            console.log("Conversion On-Chain ID found:", finalId);
                            setConversionTxId(finalId);
                        }

                        if (statusStr === 'completed' || statusStr === 'finalized' || statusStr === 'accepted') {
                            setStatus('Conversion Successful! Switching to Payment...');
                            await new Promise(r => setTimeout(r, 1500));
                            setStep('PAY');
                            isPending = false;
                        } else if (statusStr === 'failed' || statusStr === 'rejected') {
                            throw new Error('Conversion transaction rejected on-chain.');
                        }
                    } catch (err) {
                        console.warn("Polling error or pending:", err);
                    }
                }
            } else {
                throw new Error("Transaction execution failed to return a Transaction ID.");
            }
            setLoading(false);

        } catch (e: any) {
            setError(e.message);
            setLoading(false);
        }
    };

    const payInvoice = async () => {
        if (!invoice || !publicKey || !executeTransaction || !requestRecords) return;

        try {
            setLoading(true);
            setStatus('Searching for suitable private record...');
            const records = await requestRecords('credits.aleo', false);
            console.log("Wallet Records (Initial):", records);
            const amountMicro = Math.round(invoice.amount * 1_000_000);

            const recordsAny = records as any[];
            let payRecord = null;

            // Helper to get value, decrypting if needed
            const processRecord = async (r: any) => {
                let val = getMicrocredits(r);
                if (val === 0 && r.recordCiphertext && !r.plaintext && decrypt) {
                    try {
                        const decrypted = await decrypt(r.recordCiphertext);
                        if (decrypted) {
                            r.plaintext = decrypted;
                            val = getMicrocredits(r);
                        }
                    } catch (e) { console.warn("Decrypt failed:", e); }
                }
                return val;
            };

            for (const r of recordsAny) {
                if (r.spent) continue;
                const val = await processRecord(r);

                // Check spendability again after potential decryption
                const isSpendable = !!(r.plaintext || r.nonce || r._nonce || r.data?._nonce || r.ciphertext);

                if (isSpendable && val > amountMicro) {
                    payRecord = r;
                    break;
                }
            }

            let finalRecord = payRecord;

            if (!finalRecord) {
                setStatus('Syncing latest records...');
                await new Promise(r => setTimeout(r, 2000));
                const latestRecords = await requestRecords('credits.aleo', false);
                console.log("Wallet Records (Retry):", latestRecords);
                const latestRecordsAny = latestRecords as any[];

                for (const r of latestRecordsAny) {
                    if (r.spent) continue;
                    const val = await processRecord(r);
                    if (val >= amountMicro) {
                        finalRecord = r;
                        break;
                    }
                }

                if (finalRecord) {
                    setStatus('Records synced! Proceeding with payment...');
                } else {
                    setStep('CONVERT');

                    // Calculate total balance - need to decrypt all unspent
                    let totalBalance = 0;
                    let maxRecord = 0;

                    for (const r of latestRecordsAny) {
                        if (!r.spent) {
                            const val = await processRecord(r);
                            totalBalance += val;
                            if (val > maxRecord) maxRecord = val;
                        }
                    }

                    if (totalBalance >= amountMicro) {
                        setStatus(`Privacy Protocol requires a single record > ${invoice.amount}. Your largest is ${maxRecord / 1000000}. Converting ${invoice.amount} more will create a unified record.`);
                    } else {
                        setStatus(`Insufficient private balance. Converting ${invoice.amount + 0.01} to private...`);
                    }
                    setLoading(false);
                    return;
                }
            }

            console.log("Selected Pay Record:", finalRecord);
            let recordInput = finalRecord.plaintext;

            if (!recordInput) {
                console.warn("Record missing plaintext. Attempting to reconstruct...");
                const nonce = finalRecord.nonce || finalRecord._nonce || finalRecord.data?._nonce;

                if (nonce) {
                    const microcredits = getMicrocredits(finalRecord.data);
                    const owner = finalRecord.owner;
                    recordInput = `{ owner: ${owner}.private, microcredits: ${microcredits}u64.private, _nonce: ${nonce}.public }`;
                    console.log("Reconstructed Plaintext:", recordInput);
                } else if (finalRecord.ciphertext) {
                    console.log("Found Ciphertext. Using it as input.");
                    recordInput = finalRecord.ciphertext;
                } else {
                    console.warn("Could not find keys. Attempting to pass raw record object to adapter...");
                    recordInput = finalRecord;
                }
            }

            setStatus('Requesting Payment Signature...');

            const inputs = [
                recordInput,
                invoice.merchant,
                `${amountMicro}u64`,
                invoice.salt
            ];
            console.log("Transaction Inputs:", inputs);

            const transaction: TransactionOptions = {
                program: 'zk_pay_proofs_privacy_v6.aleo',
                function: 'pay_invoice',
                inputs: inputs,
                fee: 100_000
            };

            const result = await executeTransaction(transaction);
            if (result && result.transactionId) {
                setTxId(result.transactionId);
                setStatus(`Transaction Broadcasted: ${result.transactionId}. Polling confirmation...`);


                if (!wallet || !wallet.adapter) {
                    await new Promise(r => setTimeout(r, 2000));
                    setStep('SUCCESS');
                    return;
                }
                let isPending = true;
                let attempts = 0;
                while (isPending && attempts < 120) {
                    attempts++;
                    await new Promise(r => setTimeout(r, 1000));
                    try {
                        const statusRes = await wallet.adapter.transactionStatus(result.transactionId);
                        const statusStr = typeof statusRes === 'string'
                            ? (statusRes as string).toLowerCase()
                            : (statusRes as any)?.status?.toLowerCase();

                        // Check for final on-chain ID
                        if ((statusRes as any)?.transactionId) {
                            const finalId = (statusRes as any).transactionId;
                            console.log("Payment On-Chain ID found:", finalId);
                            setTxId(finalId);
                        }

                        if (statusStr === 'completed' || statusStr === 'finalized' || statusStr === 'accepted') {
                            setStep('SUCCESS');
                            setStatus('Payment Successful!');
                            isPending = false;
                        } else if (statusStr === 'failed' || statusStr === 'rejected') {
                            throw new Error('Transaction rejected on-chain.');
                        }
                    } catch (err) {
                        console.warn("Polling error or pending:", err);
                    }
                }
            } else {
                throw new Error("Transaction failed.");
            }

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Payment Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!publicKey) return;
        setStep('PAY');
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
        convertPublicToPrivate,
        handleConnect
    };
};

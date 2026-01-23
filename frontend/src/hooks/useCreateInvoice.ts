import { useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { generateSalt, createInvoiceHash } from '../utils/aleo-utils';
import { InvoiceData } from '../types/invoice';

export const useCreateInvoice = () => {
    const { publicKey, requestTransaction } = useWallet();

    const [amount, setAmount] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [expiry, setExpiry] = useState<string>('0');
    const [memo, setMemo] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    const handleCreate = async () => {
        if (!publicKey || !requestTransaction) {
            setStatus('Please connect your wallet first.');
            return;
        }
        if (!amount || amount <= 0) {
            setStatus('Please enter a valid amount.');
            return;
        }

        setLoading(true);
        setStatus('Generating invoice...');

        try {
            // 1. Generate Invoice Details
            const merchant = publicKey;
            const salt = generateSalt();

            // 2. Compute Hash
            setStatus('Computing secure hash...');
            // Buffer animation
            await new Promise(r => setTimeout(r, 800));

            const hash = await createInvoiceHash(merchant, Number(amount), salt);
            console.log("Invoice Hash:", hash);

            // 3. Request Transaction (On-Chain Commitment)
            setStatus('Preparing secure transaction...');
            await new Promise(r => setTimeout(r, 1000));

            setStatus('Requesting wallet signature...');
            const transaction = {
                address: merchant,
                chainId: WalletAdapterNetwork.TestnetBeta,
                transitions: [{
                    program: 'zk_pay_proofs_privacy_v3.aleo',
                    functionName: 'create_invoice',
                    inputs: [hash, `${expiry}u32`]
                }],
                fee: 100_000,
                feePrivate: false
            };

            const transactionId = await requestTransaction(transaction);

            if (transactionId) {
                // Generate payment link - but don't sync to backend yet
                // The transaction might fail on-chain, so we wait for confirmation
                const params = new URLSearchParams({
                    merchant,
                    amount: amount.toString(),
                    salt,
                    hash
                });
                if (memo) params.append('memo', memo);

                const link = `${window.location.origin}/pay?${params.toString()}`;

                setInvoiceData({
                    merchant,
                    amount: Number(amount),
                    salt,
                    hash,
                    link
                });
                setStatus(`Invoice created! TX ID: ${transactionId}. Verify in wallet before sharing link.`);
            }

        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message || 'Failed to create invoice'}`);
        } finally {
            setLoading(false);
        }
    };

    const resetInvoice = () => {
        setInvoiceData(null);
        setAmount('');
        setMemo('');
        setStatus('');
    };

    return {
        amount,
        setAmount,
        expiry,
        setExpiry,
        memo,
        setMemo,
        status,
        loading,
        invoiceData,
        handleCreate,
        resetInvoice,
        publicKey
    };
};

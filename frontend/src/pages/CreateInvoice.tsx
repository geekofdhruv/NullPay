import React, { useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { QRCodeSVG } from 'qrcode.react';
import { generateSalt, createInvoiceHash } from '../utils/aleo-utils';

export const CreateInvoice: React.FC = () => {
    const { publicKey, requestTransaction } = useWallet();

    const [amount, setAmount] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState<{
        merchant: string;
        amount: number;
        salt: string;
        hash: string;
        link: string;
    } | null>(null);
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
            await new Promise(r => setTimeout(r, 1000)); // buffer for user explicitly

            setStatus('Requesting wallet signature...');
            const transaction = {
                address: merchant,
                chainId: WalletAdapterNetwork.TestnetBeta,
                transitions: [{
                    program: 'zk_pay_proofs_privacy.aleo', // TODO: Update with actual deployed program ID
                    functionName: 'create_invoice',
                    inputs: [hash, `${expiry}u32`]
                }],
                fee: 100_000, // 0.1 credits approx
                feePrivate: false
            };

            const transactionId = await requestTransaction(transaction);

            if (transactionId) {
                // 4. Generate Link
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
                setStatus(`Invoice created! TX ID: ${transactionId}`);
            }

        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message || 'Failed to create invoice'}`);
        } finally {
            setLoading(false);
        }
    };

    const getExpiryLabel = (val: string) => {
        if (val === '0') return 'No Expiry';
        if (val === '1') return '1 Hour';
        if (val === '24') return '24 Hours';
        if (val === '168') return '7 Days';
        return val + ' Hours';
    };

    return (
        <div className="page-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="flex-center flex-col text-center mb-6 fade-in-up">
                <h1 className="text-gradient">Create Invoice</h1>
                {!invoiceData && (
                    <p className="text-label" style={{ fontSize: '18px', textTransform: 'none' }}>
                        Generate a privacy-preserving invoice.
                    </p>
                )}
            </div>

            <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }} className="fade-in-up delay-100">
                {!invoiceData ? (
                    <div className="glass-card mb-6">
                        <div className="form-group">
                            <label className="text-label">Amount (USDC)</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-label">Expiry</label>
                            <select
                                className="select-field"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                            >
                                <option value="0" style={{ background: '#000' }}>No Expiry (Permanent)</option>
                                <option value="1" style={{ background: '#000' }}>1 Hour</option>
                                <option value="24" style={{ background: '#000' }}>24 Hours</option>
                                <option value="168" style={{ background: '#000' }}>7 Days</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="text-label">Memo (Optional)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g., Dinner Bill"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn-primary mt-4"
                            onClick={handleCreate}
                            disabled={loading || !publicKey}
                            style={{ opacity: loading || !publicKey ? 0.6 : 1 }}
                        >
                            {loading ? (
                                <span className="flex-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : !publicKey ? (
                                'Connect Wallet to Continue'
                            ) : (
                                'Generate Invoice Link'
                            )}
                        </button>

                        {status && (
                            <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${status.includes('Error') ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
                                }`}>
                                {status}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="glass-card text-center fade-in-up" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        <h3 className="mb-4 text-gradient">Invoice Ready!</h3>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-left bg-black/20 p-4 rounded-xl border border-gray-800">
                            <div>
                                <span className="text-label">Amount</span>
                                <span className="text-white font-bold text-lg">{invoiceData.amount} USDC</span>
                            </div>
                            <div>
                                <span className="text-label">Expiry</span>
                                <span className="text-white">{getExpiryLabel(expiry)}</span>
                            </div>
                            {memo && (
                                <div className="col-span-2">
                                    <span className="text-label">Memo</span>
                                    <span className="text-gray-300">{memo}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-center mb-6 p-4 bg-white rounded-xl shadow-lg shadow-white/5" style={{ display: 'inline-flex' }}>
                            <QRCodeSVG value={invoiceData.link} size={180} />
                        </div>

                        <div className="form-group text-left">
                            <label className="text-label">Payment Link</label>
                            <div className="flex-between gap-2">
                                <span className="input-field" style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                                    {invoiceData.link}
                                </span>
                                <button
                                    className="btn-secondary"
                                    style={{ padding: '12px 16px' }}
                                    onClick={() => navigator.clipboard.writeText(invoiceData.link)}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-left">
                            <div className="p-3 rounded-lg border border-gray-700 bg-black/20">
                                <span className="text-label" style={{ fontSize: '11px' }}>Hash</span>
                                <span className="font-mono text-blue-400 truncate block text-xs" title={invoiceData.hash}>
                                    {invoiceData.hash.slice(0, 6)}...{invoiceData.hash.slice(-6)}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg border border-gray-700 bg-black/20">
                                <span className="text-label" style={{ fontSize: '11px' }}>Salt</span>
                                <span className="font-mono text-purple-400 truncate block text-xs" title={invoiceData.salt}>
                                    {invoiceData.salt.slice(0, 6)}...
                                </span>
                            </div>
                        </div>

                        <button
                            className="btn-secondary w-full"
                            onClick={() => {
                                setInvoiceData(null);
                                setAmount('');
                                setMemo('');
                                setStatus('');
                            }}
                        >
                            Create Another Invoice
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateInvoice;

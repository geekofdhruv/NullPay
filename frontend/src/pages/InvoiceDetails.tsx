import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvoiceByHash, Invoice } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const InvoiceDetails = () => {
    const { hash } = useParams<{ hash: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (hash) {
            loadInvoice(hash);
        }
    }, [hash]);

    const loadInvoice = async (h: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchInvoiceByHash(h);
            setInvoice(data);
        } catch (err: any) {
            console.error(err);
            setError("Invoice not found or could not be loaded.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
                <p className="text-label animate-pulse">Loading Invoice Details...</p>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="page-container flex-center flex-col text-center" style={{ minHeight: '60vh' }}>
                <h2 className="text-xl mb-4 text-red-400">Error</h2>
                <p className="text-small mb-6">{error || "Invoice not found"}</p>
                <button className="btn-secondary" onClick={() => navigate('/')}>
                    Back to Explorer
                </button>
            </div>
        );
    }

    return (
        <div className="page-container max-w-4xl mx-auto relative">
            {/* FLOATING ORBS */}
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-3"></div>
            </div>

            <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 mb-8 text-label hover:text-white transition-all hover:-translate-x-1"
                style={{ fontSize: '14px', letterSpacing: '0.5px' }}
            >
                <span className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">←</span>
                Back to Explorer
            </button>

            <div className="glass-card fade-in-up p-8 md:p-12 relative overflow-hidden">
                {/* DECORATIVE TOP BORDER */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
                    <div className="flex-1 overflow-hidden w-full">
                        <span className="text-label text-xs font-bold tracking-widest mb-3 flex items-center gap-2">
                            INVOICE HASH
                            <div className="h-px bg-white/10 flex-1"></div>
                        </span>
                        <h1 className="text-2xl md:text-3xl font-mono text-white break-all shadow-text-glow leading-relaxed">
                            {invoice.invoice_hash}
                        </h1>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={invoice.status as any} />
                    </div>
                </div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* COL 1 */}
                    <div className="space-y-8">
                        <div>
                            <span className="text-label mb-2 block">Merchant Address</span>
                            {invoice.merchant ? (
                                <p className="text-value font-mono text-sm break-all bg-black/20 p-3 rounded-lg border border-white/5 text-gray-300">
                                    {invoice.merchant}
                                </p>
                            ) : (
                                <p className="text-gray-500 italic">Hidden / Private</p>
                            )}
                        </div>
                        <div>
                            <span className="text-label mb-2 block">Created At</span>
                            <p className="text-value flex items-center gap-2">
                                <span className="text-lg">{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : '-'}</span>
                                <span className="text-sm text-gray-500">{invoice.created_at ? new Date(invoice.created_at).toLocaleTimeString() : ''}</span>
                            </p>
                        </div>
                    </div>

                    {/* COL 2 */}
                    <div className="space-y-8">
                        <div>
                            <span className="text-label mb-2 block">Amount</span>
                            {invoice.amount ? (
                                <p className="text-4xl font-bold text-highlight flex items-baseline gap-2">
                                    {invoice.amount}
                                    <span className="text-lg text-gray-400 font-normal">Credits</span>
                                </p>
                            ) : (
                                <p className="text-2xl text-gray-500">-</p>
                            )}
                        </div>
                        <div>
                            <span className="text-label mb-2 block">Expiry Limit</span>
                            <p className="text-value text-gray-300">
                                {invoice.block_height ? (
                                    <span>Block <span className="font-mono text-white">{invoice.block_height + 1000}</span></span>
                                ) : (
                                    'Standard (1000 Blocks)'
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* PROOF SECTION */}
                {invoice.status === 'SETTLED' ? (
                    <div className="mt-8 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-30 transition duration-1000 blur"></div>
                        <div className="relative p-6 bg-black/40 rounded-xl border border-white/10">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-400">
                                <span>Verified Proof</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </h3>
                            <p className="text-small mb-6 text-gray-400 max-w-2xl">
                                This transaction has been securely settled and verified on the Aleo Network using Zero-Knowledge Proofs.
                            </p>

                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full bg-black/50 rounded-lg border border-white/5 p-4 flex items-center justify-between group/code transition-colors hover:border-white/10">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="text-xs text-gray-500 font-mono select-none">TXID</span>
                                        <code className="font-mono text-sm text-blue-300 truncate">
                                            {invoice.transaction_id || 'Waiting for sync...'}
                                        </code>
                                    </div>
                                </div>

                                {invoice.transaction_id && (
                                    <button
                                        className="btn-primary whitespace-nowrap px-6 py-4 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                        onClick={() => window.open(`https://testnet.explorer.provable.com/transaction/${invoice.transaction_id}`, '_blank')}
                                    >
                                        View on Explorer
                                        <span className="text-lg leading-none">↗</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/5 text-center">
                        <p className="text-small opacity-50">Invoice is pending payment. Proof will be generated upon settlement.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceDetails;

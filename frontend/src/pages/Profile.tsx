import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { fetchInvoices, Invoice } from '../services/api';

const Profile = () => {
    const { publicKey } = useWallet();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (publicKey) {
            loadMerchantData();
        }
    }, [publicKey]);

    const loadMerchantData = async () => {
        if (!publicKey) return;
        setLoading(true);
        try {
            const data = await fetchInvoices({ merchant: publicKey });
            setInvoices(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!publicKey) {
        return (
            <div className="page-container flex-center flex-col text-center" style={{ minHeight: '60vh' }}>
                <h1 className="hero-title mb-6">Merchant <span className="text-gradient">Profile</span></h1>
                <p className="text-small mb-8">Connect your wallet to view your invoice history.</p>
                <WalletMultiButton />
            </div>
        );
    }

    const totalVolume = invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const settledCount = invoices.filter(i => i.status === 'SETTLED').length;

    return (
        <div className="page-container">
            <div className="flex-between mb-8 fade-in-up">
                <div>
                    <h1 className="hero-title" style={{ fontSize: '32px', marginBottom: '8px' }}>My Profile</h1>
                    <p className="text-small text-xs break-all font-mono opacity-60">
                        {publicKey}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-label block mb-1">Total Received</span>
                    <span className="text-highlight text-3xl">{totalVolume} Credits</span>
                </div>
            </div>

            <div className="grid-cols-3 gap-6 mb-12 fade-in-up delay-100">
                <div className="glass-card p-6">
                    <span className="text-label block mb-2">Total Invoices</span>
                    <span className="text-2xl">{invoices.length}</span>
                </div>
                <div className="glass-card p-6">
                    <span className="text-label block mb-2">Settled</span>
                    <span className="text-2xl text-green-400">{settledCount}</span>
                </div>
                <div className="glass-card p-6">
                    <span className="text-label block mb-2">Pending</span>
                    <span className="text-2xl text-yellow-500">{invoices.length - settledCount}</span>
                </div>
            </div>

            <div className="glass-card fade-in-up delay-200">
                <div className="flex-between mb-6">
                    <h3 className="text-xl font-bold">Recent Invoices</h3>
                    <button className="btn-secondary text-xs p-2" onClick={loadMerchantData}>Refresh</button>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="p-8 text-center text-label">Loading history...</div>
                    ) : invoices.length === 0 ? (
                        <div className="p-8 text-center text-label">No invoices created yet.</div>
                    ) : (
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Hash</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv, i) => (
                                    <tr key={i}>
                                        <td className="font-mono text-white text-sm">
                                            {inv.invoice_hash.slice(0, 10)}...
                                        </td>
                                        <td className="text-highlight">
                                            {inv.amount ? `${inv.amount}` : '-'}
                                        </td>
                                        <td><StatusBadge status={inv.status as any} /></td>
                                        <td className="text-xs text-label">
                                            {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="text-right">
                                            {inv.transaction_id && (
                                                <a
                                                    href={`https://testnet.explorer.provable.com/transaction/${inv.transaction_id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary hover:underline text-xs"
                                                >
                                                    View TX
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

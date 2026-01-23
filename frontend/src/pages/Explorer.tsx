import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { fetchInvoices, Invoice } from '../services/api';

const Explorer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        loadData();
    }, [activeFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Filter mapping: 'all' -> undefined, 'pending' -> 'PENDING'
            const statusFilter = activeFilter === 'all' ? undefined : activeFilter.toUpperCase();
            const data = await fetchInvoices({ status: statusFilter });
            setInvoices(data);
        } catch (e) {
            console.error("Failed to load invoices", e);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Stats from Real Data
    // Note: In a production app, these should come from a stats endpoint to avoid downloading everything.
    const stats = [
        { label: 'Total Invoices', value: invoices.length.toString() },
        { label: 'Pending', value: invoices.filter(i => i.status === 'PENDING').length.toString() },
        { label: 'Settled', value: invoices.filter(i => i.status === 'SETTLED').length.toString() },
        // Simple aggregates for demo
        { label: 'Volume', value: `${invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0)} Credits` },
    ];

    const filteredInvoices = invoices.filter(inv =>
        inv.invoice_hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.merchant && inv.merchant.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="page-container" style={{ position: 'relative' }}>
            {/* FLOATING ORBS BACKGROUND */}
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* HERO */}
            <div className="text-center mb-8 fade-in-up">
                <h1 className="hero-title">The <span className="text-gradient">Privacy-First</span> Explorer</h1>
                <p className="text-small" style={{ fontSize: '16px', color: '#888', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                    Track payments and invoices with zero-knowledge privacy.
                </p>

                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search invoice hash or merchant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid-cols-4 gap-4 mb-8 fade-in-up delay-100">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card flex-col flex-center" style={{ padding: '24px' }}>
                        <span className="text-label" style={{ marginBottom: '8px' }}>{stat.label}</span>
                        <span className="text-value" style={{ fontSize: '22px' }}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* TABLE SECTION */}
            <div className="glass-card fade-in-up delay-200" style={{ padding: '0' }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '24px 24px 0 24px',
                    marginBottom: '20px'
                }}>
                    {['all', 'pending', 'settled'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        >
                            {filter}
                        </button>
                    ))}
                    <button className="btn-secondary ml-auto" onClick={loadData} style={{ padding: '4px 12px', fontSize: '12px' }}>
                        Refresh
                    </button>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="p-8 text-center text-label">Loading data...</div>
                    ) : (
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Hash</th>
                                    <th>Merchant</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th style={{ textAlign: 'right' }}>TX ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center p-4 text-label">No invoices found</td></tr>
                                ) : (
                                    filteredInvoices.map((inv, i) => (
                                        <tr key={i}>
                                            <td style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                                                <a
                                                    href={`/invoice/${inv.invoice_hash}`}
                                                    className="text-white hover:text-primary transition-colors cursor-pointer"
                                                >
                                                    {inv.invoice_hash.slice(0, 6)}...{inv.invoice_hash.slice(-4)}
                                                </a>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: '#aaa', fontSize: '12px' }}>
                                                {inv.merchant ? `${inv.merchant.slice(0, 6)}...` : '-'}
                                            </td>
                                            <td className="text-highlight">
                                                {inv.amount ? `${inv.amount}` : '-'}
                                            </td>
                                            <td>
                                                <StatusBadge status={inv.status as any} />
                                            </td>
                                            <td className="text-xs text-label">
                                                {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#666' }}>
                                                <div className="flex items-center justify-end gap-3">
                                                    <a
                                                        href={`/invoice/${inv.invoice_hash}`}
                                                        className="text-xs font-semibold text-primary hover:text-white transition-colors border border-primary/20 px-2 py-1 rounded hover:bg-primary/10"
                                                    >
                                                        Details
                                                    </a>
                                                    {inv.transaction_id && (
                                                        <a
                                                            href={`https://testnet.explorer.provable.com/transaction/${inv.transaction_id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            Chain <span className="text-[10px]">↗</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Explorer;

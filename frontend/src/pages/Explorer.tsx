import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';

const Explorer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const stats = [
        { label: 'Total Invoices', value: '1,234' },
        { label: 'Pending', value: '156' },
        { label: 'Settled', value: '1,078' },
        { label: 'Merchants', value: '342' },
        { label: '24h Volume', value: '$50,000' },
    ];

    const mockInvoices = [
        { hash: '0x7f8a...3d2f', status: 'PENDING', created: '2h ago', expiry: '2h left', block: '#123456' },
        { hash: '0x9abc...1e4g', status: 'SETTLED', created: '5h ago', expiry: 'Paid', block: '#123450' },
        { hash: '0x2def...8h9i', status: 'EXPIRED', created: '1d ago', expiry: 'Expired', block: '#123400' },
        { hash: '0x5ghi...2j3k', status: 'SETTLED', created: '2d ago', expiry: 'Paid', block: '#123389' },
        { hash: '0x8lmn...5o6p', status: 'PENDING', created: '3m ago', expiry: '24h left', block: '#123458' },
    ] as const;

    return (
        <div className="page-container">

            {/* HERO */}
            <div className="text-center mb-8">
                <h1 className="hero-title">The <span className="text-gradient">Privacy-First</span> Explorer</h1>
                <p className="text-small" style={{ fontSize: '16px', color: '#888', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                    Track payments and invoices with zero-knowledge privacy.
                </p>

                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search invoice hash..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid-cols-5 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card flex-col flex-center" style={{ padding: '24px' }}>
                        <span className="text-label" style={{ marginBottom: '8px' }}>{stat.label}</span>
                        <span className="text-value" style={{ fontSize: '22px' }}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* TABLE SECTION */}
            <div className="glass-card" style={{ padding: '0' }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '24px 24px 0 24px',
                    marginBottom: '20px'
                }}>
                    {['all', 'pending', 'settled', 'expired'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="table-container">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Hash</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Expiry</th>
                                <th style={{ textAlign: 'right' }}>Block</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockInvoices.map((inv, i) => (
                                <tr key={i}>
                                    <td style={{ fontFamily: 'monospace', color: '#fff', fontWeight: '500' }}>{inv.hash}</td>
                                    <td>
                                        <StatusBadge status={inv.status as any} />
                                    </td>
                                    <td>{inv.created}</td>
                                    <td>{inv.expiry}</td>
                                    <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#666' }}>{inv.block}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Explorer;

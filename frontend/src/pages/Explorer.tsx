import { useState } from 'react';

const Explorer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const stats = [
        { label: 'Total Invoices', value: '1,234', color: 'white' },
        { label: 'Pending', value: '156', color: '#ffaa00' },
        { label: 'Settled', value: '1,078', color: '#00ff88' },
        { label: 'Merchants', value: '342', color: '#44aaff' },
        { label: '24h Volume', value: '$50,000', color: 'white' },
    ];

    const mockInvoices = [
        { hash: '0x7f8a...3d2f', status: 'pending', created: '2h ago', expiry: '2h left', block: '#123456' },
        { hash: '0x9abc...1e4g', status: 'settled', created: '5h ago', expiry: 'Paid', block: '#123450' },
        { hash: '0x2def...8h9i', status: 'expired', created: '1d ago', expiry: 'Expired', block: '#123400' },
    ];

    return (
        <div className="container" style={{ paddingTop: '120px' }}>

            {/* HERO */}
            <div className="text-center mb-6">
                <h1 className="hero-title">The <span className="text-green">Privacy-First</span> Explorer</h1>
                <p className="text-gray mb-6">Track payments and invoices with zero-knowledge privacy.</p>

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
            <div className="grid-cols-5 mb-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card flex-col flex-center">
                        <span className="text-small mb-2">{stat.label}</span>
                        <span className="text-xl" style={{ color: stat.color }}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* TABLE SECTION */}
            <div className="glass-card">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                    {['all', 'pending', 'settled', 'expired'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            style={{
                                background: activeFilter === filter ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: 'none',
                                color: activeFilter === filter ? 'white' : '#888',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                fontWeight: '600'
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

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
                                <td style={{ fontFamily: 'monospace', color: '#00ff88' }}>{inv.hash}</td>
                                <td>
                                    <span className={`badge badge-${inv.status}`}>{inv.status.toUpperCase()}</span>
                                </td>
                                <td>{inv.created}</td>
                                <td>{inv.expiry}</td>
                                <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{inv.block}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Explorer;

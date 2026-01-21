const Profile = () => {
    const merchant = {
        address: 'aleo1...9xyz',
        balance: '5,420 USDC',
        totalSales: '150,000 USDC',
        invoices: 45
    };

    const myInvoices = [
        { id: '#1001', amount: '500 USDC', status: 'PAID', date: '2023-10-25' },
        { id: '#1002', amount: '120 USDC', status: 'PENDING', date: '2023-10-26' },
        { id: '#1003', amount: '2,000 USDC', status: 'PAID', date: '2023-10-27' },
    ];

    return (
        <div className="page-container">
            {/* HEADER */}
            <div className="flex-between mb-8">
                <div>
                    <h1 className="text-gradient">Merchant Dashboard</h1>
                    <p className="text-label">Manage your earnings and invoices</p>
                </div>
                <div className="glass-card flex-center" style={{ padding: '12px 24px' }}>
                    <span className="text-green" style={{ marginRight: '12px' }}>●</span>
                    <span style={{ fontFamily: 'monospace' }}>{merchant.address}</span>
                </div>
            </div>

            {/* STATS */}
            <div className="grid-cols-5 mb-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="glass-card">
                    <span className="text-label">Wallet Balance</span>
                    <h2 className="text-green">{merchant.balance}</h2>
                </div>
                <div className="glass-card">
                    <span className="text-label">Total Sales Volume</span>
                    <h2>{merchant.totalSales}</h2>
                </div>
                <div className="glass-card">
                    <span className="text-label">Total Invoices</span>
                    <h2>{merchant.invoices}</h2>
                </div>
            </div>

            {/* INVOICE HISTORY */}
            <div className="glass-card">
                <div className="flex-between mb-6">
                    <h3>Recent Invoices</h3>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Download CSV</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myInvoices.map((inv, i) => (
                            <tr key={i}>
                                <td style={{ fontFamily: 'monospace', color: '#888' }}>{inv.id}</td>
                                <td style={{ fontWeight: 'bold' }}>{inv.amount}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        background: inv.status === 'PAID' ? 'rgba(0,255,136,0.1)' : 'rgba(255,170,0,0.1)',
                                        color: inv.status === 'PAID' ? '#00ff88' : '#ffaa00'
                                    }}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="text-label">{inv.date}</td>
                                <td className="text-right">
                                    <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Profile;

import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

interface Invoice {
    id: string;
    amount: string;
    status: string;
    date: string;
}

const Profile = () => {
    const { address } = useWallet();
    const publicKey = address;
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const myInvoices: Invoice[] = [
        { id: '#1001', amount: '500 USDC', status: 'SETTLED', date: '2023-10-25' },
        { id: '#1002', amount: '120 USDC', status: 'PENDING', date: '2023-10-26' },
        { id: '#1003', amount: '2,000 USDC', status: 'SETTLED', date: '2023-10-27' },
    ];

    const merchant = {
        address: publicKey ? `${publicKey.slice(0, 10)}...${publicKey.slice(-5)}` : 'Not Connected',
        balance: '5,420 USDC',
        totalSales: '150,000 USDC',
        invoices: myInvoices.length
    };

    useEffect(() => {
        if (publicKey) {
            setInvoices(myInvoices);
        }
    }, [publicKey]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="page-container min-h-screen">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-7xl mx-auto"
            >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div>
                        <motion.h1 variants={itemVariants} className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                            Merchant Dashboard
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-400">
                            Manage your earnings and invoices
                        </motion.p>
                    </div>
                    {publicKey && (
                        <motion.div variants={itemVariants} className="bg-glass-surface backdrop-blur-md border border-white/10 rounded-full px-5 py-2 flex items-center gap-3 shadow-lg">
                            <div className="w-2 h-2 bg-neon-primary rounded-full shadow-[0_0_8px_rgba(0,243,255,0.8)] animate-pulse" />
                            <span className="font-mono text-sm text-gray-200">{merchant.address}</span>
                        </motion.div>
                    )}
                </div>

                {/* STATS */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <GlassCard className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Wallet Balance</span>
                        <h2 className="text-4xl font-bold text-white mt-2 group-hover:scale-105 transition-transform duration-300 origin-left">{merchant.balance}</h2>
                    </GlassCard>

                    <GlassCard className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-neon-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Total Sales Volume</span>
                        <h2 className="text-4xl font-bold text-white mt-2 group-hover:scale-105 transition-transform duration-300 origin-left">{merchant.totalSales}</h2>
                    </GlassCard>

                    <GlassCard className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-neon-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Total Invoices</span>
                        <h2 className="text-4xl font-bold text-white mt-2 group-hover:scale-105 transition-transform duration-300 origin-left">{merchant.invoices}</h2>
                    </GlassCard>
                </motion.div>

                {/* INVOICE HISTORY */}
                <GlassCard variants={itemVariants} className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-white/5">
                        <h3 className="text-xl font-semibold text-white">Recent Invoices</h3>
                        <Button variant="secondary" size="sm">Download CSV</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black/20 text-left">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invoices.map((inv, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 font-mono text-gray-400 group-hover:text-white transition-colors">{inv.id}</td>
                                        <td className="py-4 px-6 font-bold text-white">{inv.amount}</td>
                                        <td className="py-4 px-6">
                                            <StatusBadge status={inv.status as any} />
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-400">{inv.date}</td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-sm text-neon-primary hover:text-white transition-colors font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default Profile;

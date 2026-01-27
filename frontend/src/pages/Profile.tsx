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
        { id: '#1001', amount: '500 Credits', status: 'SETTLED', date: '2023-10-25' },
        { id: '#1002', amount: '120 Credits', status: 'PENDING', date: '2023-10-26' },
        { id: '#1003', amount: '2,000 Credits', status: 'SETTLED', date: '2023-10-27' },
    ];

    const merchant = {
        address: publicKey ? `${publicKey.slice(0, 10)}...${publicKey.slice(-5)}` : 'Not Connected',
        balance: '5,420 Credits',
        totalSales: '150,000 Credits',
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
        <div className="page-container relative min-h-screen">
            {/* FLOATING ORBS BACKGROUND */}
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-7xl mx-auto"
            >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 mt-12">
                    <motion.div variants={itemVariants} className="text-left">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tighter leading-none">
                            Merchant <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-primary to-neon-accent animate-shine bg-[length:200%_auto]">Dashboard</span>
                        </h1>
                        <p className="text-gray-400 text-xl max-w-xl leading-relaxed">
                            Manage your earnings, track invoices, and monitor your business performance in real-time.
                        </p>
                    </motion.div>

                    {publicKey && (
                        <motion.div variants={itemVariants} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-neon-primary rounded-full shadow-[0_0_10px_rgba(0,243,255,0.8)] animate-pulse" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Wallet Connected</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="font-mono text-sm text-white font-medium tracking-wide">{merchant.address}</span>
                        </motion.div>
                    )}
                </div>

                {/* STATS */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <GlassCard className="p-8 relative overflow-hidden group hover:border-white/20">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block group-hover:text-neon-primary transition-colors">Wallet Balance</span>
                        <h2 className="text-5xl font-bold text-white group-hover:scale-105 transition-transform duration-300 origin-left tracking-tighter">{merchant.balance}</h2>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-neon-primary text-xs font-bold bg-neon-primary/10 px-2 py-1 rounded">+12.5%</span>
                            <span className="text-gray-500 text-xs">vs last month</span>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 relative overflow-hidden group hover:border-neon-primary/30">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <svg className="w-32 h-32 text-neon-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block group-hover:text-neon-primary transition-colors">Total Volume</span>
                        <h2 className="text-5xl font-bold text-white group-hover:scale-105 transition-transform duration-300 origin-left tracking-tighter">{merchant.totalSales}</h2>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-neon-primary text-xs font-bold bg-neon-primary/10 px-2 py-1 rounded">+8.2%</span>
                            <span className="text-gray-500 text-xs">vs last month</span>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 relative overflow-hidden group hover:border-neon-secondary/30">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <svg className="w-32 h-32 text-neon-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block group-hover:text-neon-secondary transition-colors">Invoices Created</span>
                        <h2 className="text-5xl font-bold text-white group-hover:scale-105 transition-transform duration-300 origin-left tracking-tighter">{merchant.invoices}</h2>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-neon-secondary text-xs font-bold bg-neon-secondary/10 px-2 py-1 rounded text-white">+5 New</span>
                            <span className="text-gray-500 text-xs">this week</span>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* INVOICE HISTORY */}
                <GlassCard variants={itemVariants} className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-black/20">
                        <h3 className="text-xl font-bold text-white">Recent Invoices</h3>
                        <Button variant="secondary" size="sm" className="!text-xs !py-2">Download CSV</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 text-left">
                                    <th className="py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                                    <th className="py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-5 px-8 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invoices.map((inv, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                        <td className="py-5 px-8 font-mono text-neon-accent group-hover:text-neon-primary transition-colors text-sm">{inv.id}</td>
                                        <td className="py-5 px-8 font-bold text-white text-lg">{inv.amount}</td>
                                        <td className="py-5 px-8">
                                            <StatusBadge status={inv.status as any} />
                                        </td>
                                        <td className="py-5 px-8 text-sm text-gray-400 font-medium">{inv.date}</td>
                                        <td className="py-5 px-8 text-right">
                                            <button className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider border border-white/10 hover:border-neon-primary px-3 py-1.5 rounded-full transition-all">
                                                Details
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

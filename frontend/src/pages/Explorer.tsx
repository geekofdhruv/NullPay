import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';

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
        { label: 'Total Invoices', value: '1,234', trend: '+12%' },
        { label: 'Pending', value: '156', trend: '-5%' },
        { label: 'Settled', value: '1,078', trend: '+18%' },
        { label: 'Merchants', value: '342', trend: '+2%' },
        { label: '24h Volume', value: '$50,000', trend: '+8%' },
    ];

    const filteredInvoices = invoices.filter(inv =>
        inv.invoice_hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.merchant && inv.merchant.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
                <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6 mt-12">
                    <motion.div variants={itemVariants} className="text-left">
                        <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tighter">
                            Privacy-First <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-primary to-neon-accent animate-shine bg-[length:200%_auto]">Explorer</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Track payments and invoices with zero-knowledge privacy.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="w-full md:w-auto min-w-[300px]">
                        <Input
                            placeholder="Search invoice hash..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/50 backdrop-blur-md border-white/10 focus:border-neon-primary/50"
                        />
                    </motion.div>
                </div>

                {/* STATS GRID */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                    {stats.map((stat, i) => (
                        <GlassCard key={i} className="p-6 flex flex-col items-center justify-center text-center group cursor-default">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-neon-primary transition-colors">{stat.label}</span>
                            <span className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</span>
                            <span className={stat.trend.startsWith('+') ? "text-neon-primary text-xs" : "text-red-400 text-xs"}>
                                {stat.trend}
                            </span>
                        </GlassCard>
                    ))}
                </motion.div>

                {/* TABLE SECTION */}
                <GlassCard variants={itemVariants} className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                        <div className="flex bg-black/30 rounded-full p-1 border border-white/5">
                            {['all', 'pending', 'settled', 'expired'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeFilter === filter
                                        ? 'bg-neon-primary/10 text-neon-primary shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 text-left">
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Hash</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Expiry</th>
                                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Block</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {mockInvoices.map((inv, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6 font-mono text-neon-accent group-hover:text-neon-primary transition-colors">{inv.hash}</td>
                                        <td className="py-4 px-6">
                                            <StatusBadge status={inv.status as any} />
                                        </td>
                                        <td className="py-4 px-6 text-gray-300">{inv.created}</td>
                                        <td className="py-4 px-6 text-gray-300">{inv.expiry}</td>
                                        <td className="py-4 px-6 text-right font-mono text-gray-500 group-hover:text-white transition-colors">{inv.block}</td>
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

export default Explorer;

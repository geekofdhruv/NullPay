import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '../components/StatusBadge';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';

const Explorer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const marketData = {
        price: 10.80,
        change: -3.49,
        trend: [10, 12, 8, 11, 9, 15, 13, 16, 14, 18, 12, 10]
    };

    const networkStats = {
        totalStake: "1.17B",
        stakingApy: "6.6%",
        percentStaked: "69.7%",
        totalTransactions: "1.24M",
        coinbaseTarget: "536.87M",
        proofTarget: "134.22M",
        validators: 29,
        provers: 120,
        deployedPrograms: "6.8K"
    };

    const mockInvoices = [
        { hash: '0x7f8a...3d2f', status: 'PENDING', created: '2h ago', expiry: '2h left', block: '#123456' },
        { hash: '0x9abc...1e4g', status: 'SETTLED', created: '5h ago', expiry: 'Paid', block: '#123450' },
        { hash: '0x2def...8h9i', status: 'EXPIRED', created: '1d ago', expiry: 'Expired', block: '#123400' },
        { hash: '0x5ghi...2j3k', status: 'SETTLED', created: '2d ago', expiry: 'Paid', block: '#123389' },
        { hash: '0x8lmn...5o6p', status: 'PENDING', created: '3m ago', expiry: '24h left', block: '#123458' },
    ] as const;

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

    // Simple SVG Sparkline
    const Sparkline = ({ data, color = "stroke-white" }: { data: number[], color?: string }) => {
        const max = Math.max(...data);
        const min = Math.min(...data);
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((d - min) / (max - min)) * 100;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d">
                <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M0,100 L0,${100 - ((data[0] - min) / (max - min)) * 100} ${points.split(' ').map(p => `L${p}`).join(' ')} L100,100 Z`} fill="url(#gradient)" className="opacity-50" />
                <polyline
                    fill="none"
                    strokeWidth="2"
                    points={points}
                    className={`${color} vector-effect-non-scaling-stroke`}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    return (
        <div className="page-container relative min-h-screen">
            <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-float" />
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-zinc-800/20 rounded-full blur-[100px] animate-float-delayed" />
                <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-white/5 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            {/* ALEO GLOBE BACKGROUND */}
            <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-screen h-[800px] z-0 pointer-events-none flex justify-center overflow-hidden">
                <img
                    src="/assets/aleo_globe.png"
                    alt="Aleo Globe"
                    className="w-full h-full object-cover opacity-50 mix-blend-screen mask-image-gradient-b"
                    style={{
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
                    }}
                />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-7xl mx-auto pt-12 pb-20 relative z-10"
            >
                {/* HERO SECTION - CENTERED */}
                <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-white">
                        The Ledger of <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Private Commerce</span>
                    </h1>

                    <div className="w-full max-w-2xl relative">
                        <Input
                            placeholder="SEARCH BY PROGRAM, BLOCK, OR TRANSACTION..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 pl-12 bg-white/5 border border-white/10 rounded-full focus:border-white/30 text-lg placeholder:text-gray-600 font-mono"
                        />
                        <div className="absolute right-3 top-2 bottom-2 bg-white/10 px-3 flex items-center rounded-full text-xs font-mono text-gray-400 border border-white/5">
                            /
                        </div>
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </motion.div>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                    {/* CARD 1: ALEO PRICE / ACTIVITY (Large) */}
                    <GlassCard className="col-span-1 md:col-span-2 row-span-1 p-8 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">A</div>
                                <h3 className="text-2xl font-bold text-white">Aleo</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-mono text-white">${marketData.price.toFixed(4)}</p>
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/10 ${marketData.change >= 0 ? 'text-white' : 'text-gray-400'}`}>
                                    {marketData.change}%
                                </span>
                            </div>
                        </div>
                        <div className="h-32 w-full">
                            <Sparkline data={marketData.trend} />
                        </div>
                        <div className="flex justify-between text-xs font-mono text-gray-500 mt-4 border-t border-white/5 pt-4">
                            <span>3:02 PM</span>
                            <span>NOW</span>
                        </div>
                    </GlassCard>

                    {/* CARD 2: NETWORK STAKE */}
                    <GlassCard className="col-span-1 p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Total Network Stake
                        </div>
                        <div className="text-4xl font-bold text-white mb-6">
                            {networkStats.totalStake} <span className="text-base text-gray-600 align-top">A</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Staking APY</div>
                                <div className="text-xl font-bold text-white">{networkStats.stakingApy}</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">% Staked</div>
                                <div className="text-xl font-bold text-white">{networkStats.percentStaked}</div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* CARD 3: TRANSACTIONS CHART */}
                    <GlassCard className="col-span-1 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Total TXs
                            </div>
                            <span className="text-[10px] text-gray-600 border border-white/10 px-1 rounded">ALL TIME</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-4">
                            {networkStats.totalTransactions}
                        </div>
                        <div className="h-24 w-full relative">
                            {/* Mock Bar Chart using Flex */}
                            <div className="flex items-end justify-between h-full gap-1">
                                {[20, 35, 10, 80, 40, 50, 20, 60, 10, 5].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className="w-full bg-white/20 hover:bg-white rounded-t-sm transition-colors" />
                                ))}
                                <div style={{ height: `100%` }} className="w-full bg-white animate-pulse rounded-t-sm" />
                            </div>
                        </div>
                    </GlassCard>

                    {/* ROW 2: SMALL METRICS */}
                    <GlassCard className="col-span-1 p-6">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-1 h-1 bg-white rounded-full" /> Coinbase Target
                        </div>
                        <div className="text-2xl font-bold text-white mt-2">{networkStats.coinbaseTarget}</div>
                    </GlassCard>

                    <GlassCard className="col-span-1 p-6">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-1 h-1 bg-white rounded-full" /> Proof Target
                        </div>
                        <div className="text-2xl font-bold text-white mt-2">{networkStats.proofTarget}</div>
                    </GlassCard>

                    <GlassCard className="col-span-1 p-6">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            Total Validators
                        </div>
                        <div className="text-3xl font-bold text-white mt-1">{networkStats.validators}</div>
                    </GlassCard>

                    <GlassCard className="col-span-1 p-6">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Total Provers
                        </div>
                        <div className="text-3xl font-bold text-white mt-1">{networkStats.provers}</div>
                    </GlassCard>

                    {/* ROW 3: FOOTER STATS */}
                    <GlassCard className="col-span-1 md:col-span-2 p-6 flex justify-between items-end relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Deployed Programs</div>
                            <div className="text-4xl font-bold text-white">{networkStats.deployedPrograms}</div>
                        </div>
                        <div className="text-xs font-mono text-gray-500 relative z-10">
                            ALL TIME
                        </div>
                        {/* Background Decor */}
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 translate-y-10" />
                    </GlassCard>

                    <GlassCard className="col-span-1 md:col-span-2 p-6 flex justify-between items-end">
                        <div>
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Program Calls (Week)</div>
                            <div className="text-4xl font-bold text-white">4,831</div>
                        </div>
                        <div className="h-12 w-24">
                            <Sparkline data={[5, 10, 8, 15, 20, 18, 25]} color="stroke-white" />
                        </div>
                    </GlassCard>

                </div>

                {/* TABLE SECTION (Full Width) */}
                <GlassCard variants={itemVariants} className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Recent Invoices</h2>
                        <div className="flex bg-black/30 rounded-full p-1 border border-white/5">
                            {['all', 'pending', 'settled', 'expired'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeFilter === filter
                                        ? 'bg-white text-black shadow-lg'
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
                                        <td className="py-4 px-6 font-mono text-white group-hover:text-gray-300 transition-colors">{inv.hash}</td>
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
        </div >
    );
};

export default Explorer;

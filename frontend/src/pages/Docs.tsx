import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';

const Docs = () => {
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
                className="w-full max-w-6xl mx-auto pt-12 pb-20 px-6"
            >
                {/* HERO */}
                <motion.div variants={itemVariants} className="text-left mb-16 border-b border-white/10 pb-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
                        Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-primary to-neon-accent animate-shine bg-[length:200%_auto]">AleoZKPay?</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-4xl leading-relaxed">
                        In a world of surveillance, <span className="text-neon-primary font-bold">privacy is a human right.</span> AleoZKPay leverages Zero-Knowledge Proofs on the Aleo blockchain to allow you to send and receive payments without revealing sensitive data to the public network.
                    </p>
                </motion.div>

                {/* CORE BENEFITS */}
                <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-neon-primary">
                    Core Benefits
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <GlassCard className="p-8 hover:border-neon-primary/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-neon-primary/10 flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-neon-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge Privacy</h3>
                        <p className="text-gray-400">
                            Your financial history is yours alone. We use advanced ZK proofs to verify transactions without exposing the sender, amount, or recipient on the public ledger.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8 hover:border-neon-accent/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-neon-accent/10 flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-neon-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Seamless Experience</h3>
                        <p className="text-gray-400">
                            Crypto payments shouldn't be hard. Generate a link, share it, and get paid. Our intuitive UI handles the complex cryptography behind the scenes.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8 hover:border-purple-500/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Trustless Verification</h3>
                        <p className="text-gray-400">
                            Don't trust us—verify everything. Every invoice is hashed and stored on-chain. Anyone can verify a payment's validity without knowing its details.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8 hover:border-pink-500/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">For Everyone</h3>
                        <p className="text-gray-400">
                            Whether you're a freelancer, a merchant, or just splitting a bill—AleoZKPay is built for anyone who values their financial privacy.
                        </p>
                    </GlassCard>
                </div>

                {/* TECHNICAL ARCHITECTURE */}
                <motion.div variants={itemVariants} className="space-y-12">
                    <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-neon-accent">
                        Technical Architecture & Workflow
                    </h2>

                    <GlassCard className="p-8 space-y-8">
                        {/* STEP 1 */}
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-8 h-8 rounded-full bg-neon-primary/20 text-neon-primary flex items-center justify-center text-sm font-bold">1</span>
                                <h3 className="text-xl font-bold text-white">Merchant Creates Invoice</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 pl-12">
                                The merchant inputs the amount and expiry. A random 128-bit 'salt' is generated locally.
                                We compute the hash of the data off-chain using the BHP256 algorithm.
                            </p>
                            <div className="pl-12">
                                <GlassCard variant="heavy" className="p-4 font-mono text-xs text-gray-400 overflow-x-auto border-neon-primary/20">
                                    <div>const merchant_hash = BHP256.hash(merchant_addr);</div>
                                    <div>const amount_hash = BHP256.hash(amount);</div>
                                    <div>const salt_hash = BHP256.hash(random_salt);</div>
                                    <div>const invoice_hash = merchant_hash + amount_hash + salt_hash;</div>
                                </GlassCard>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-8 h-8 rounded-full bg-neon-primary/20 text-neon-primary flex items-center justify-center text-sm font-bold">2</span>
                                <h3 className="text-xl font-bold text-white">On-Chain Commitment</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 pl-12">
                                The merchant signs the transaction. Only the <code className="text-gray-300">invoice_hash</code> and the mapping from <code className="text-gray-300">salt &rarr; hash</code> are stored on the Aleo blockchain.
                                The actual amount and merchant address are never revealed publicly.
                            </p>
                        </div>

                        {/* STEP 3 */}
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-8 h-8 rounded-full bg-neon-primary/20 text-neon-primary flex items-center justify-center text-sm font-bold">3</span>
                                <h3 className="text-xl font-bold text-white">Secure Payment Verification</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 pl-12">
                                When a user pays, the smart contract receives the private details and the salt. It re-computes the hash on-chain and enforces that it matches the stored invoice hash.
                            </p>
                            <div className="pl-12">
                                <GlassCard variant="heavy" className="p-4 font-mono text-xs text-gray-400 overflow-x-auto border-neon-primary/20">
                                    <div>credits.aleo/transfer_private(pay_record, merchant, amount);</div>
                                    <br />
                                    <div>let computed_hash = merchant_hash + amount_hash + salt_hash;</div>
                                    <div>let stored_hash = salt_to_invoice.get(salt);</div>
                                    <br />
                                    <div className="text-neon-primary">assert_eq(computed_hash, stored_hash);</div>
                                </GlassCard>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Docs;

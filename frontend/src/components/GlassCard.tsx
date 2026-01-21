import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

const GlassCard = ({ children, className = '' }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`glass-card rounded-2xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;

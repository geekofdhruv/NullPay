interface StatusBadgeProps {
    status: 'PENDING' | 'SETTLED' | 'EXPIRED';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const styles = {
        PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
        SETTLED: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]',
        EXPIRED: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]',
    };

    const dotColor = {
        PENDING: 'bg-yellow-400',
        SETTLED: 'bg-green-400',
        EXPIRED: 'bg-red-400',
    };

    return (
        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColor[status]}`}></span>
            <span>{status}</span>
        </span>
    );
};

export default StatusBadge;

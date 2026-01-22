import React from 'react';

interface InvoiceFormProps {
    amount: number | '';
    setAmount: (val: number | '') => void;
    expiry: string;
    setExpiry: (val: string) => void;
    memo: string;
    setMemo: (val: string) => void;
    handleCreate: () => void;
    loading: boolean;
    publicKey: string | null;
    status: string;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
    amount,
    setAmount,
    expiry,
    setExpiry,
    memo,
    setMemo,
    handleCreate,
    loading,
    publicKey,
    status
}) => {
    return (
        <div className="glass-card mb-6">
            <div className="form-group">
                <label className="text-label">Amount (USDC)</label>
                <input
                    type="number"
                    className="input-field"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                />
            </div>

            <div className="form-group">
                <label className="text-label">Expiry</label>
                <select
                    className="select-field"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                >
                    <option value="0" style={{ background: '#000' }}>No Expiry (Permanent)</option>
                    <option value="1" style={{ background: '#000' }}>1 Hour</option>
                    <option value="24" style={{ background: '#000' }}>24 Hours</option>
                    <option value="168" style={{ background: '#000' }}>7 Days</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-label">Memo (Optional)</label>
                <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Dinner Bill"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                />
            </div>

            <button
                className="btn-primary mt-4"
                onClick={handleCreate}
                disabled={loading || !publicKey}
                style={{ opacity: loading || !publicKey ? 0.6 : 1 }}
            >
                {loading ? (
                    'Creating Invoice...'
                ) : !publicKey ? (
                    'Connect Wallet to Continue'
                ) : (
                    'Generate Invoice Link'
                )}
            </button>

            {status && (
                <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${status.includes('Error') ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
                    }`}>
                    {status}
                </div>
            )}
        </div>
    );
};

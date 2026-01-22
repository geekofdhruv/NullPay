import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InvoiceData } from '../../types/invoice';

interface InvoiceCardProps {
    invoiceData: InvoiceData;
    resetInvoice: () => void;
    expiry: string;
    memo: string;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
    invoiceData,
    resetInvoice,
    expiry,
    memo
}) => {
    const getExpiryLabel = (val: string) => {
        if (val === '0') return 'No Expiry';
        if (val === '1') return '1 Hour';
        if (val === '24') return '24 Hours';
        if (val === '168') return '7 Days';
        return val + ' Hours';
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(invoiceData.link);
    };

    return (
        <div className="glass-card text-center fade-in-up" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 className="mb-4 text-gradient">Invoice Ready!</h3>

            <div className="grid grid-cols-2 gap-4 mb-6 text-left bg-black/20 p-4 rounded-xl border border-gray-800">
                <div>
                    <span className="text-label">Amount</span>
                    <span className="text-white font-bold text-lg">{invoiceData.amount} USDC</span>
                </div>
                <div>
                    <span className="text-label">Expiry</span>
                    <span className="text-white">{getExpiryLabel(expiry)}</span>
                </div>
                {memo && (
                    <div className="col-span-2">
                        <span className="text-label">Memo</span>
                        <span className="text-gray-300">{memo}</span>
                    </div>
                )}
            </div>

            <div className="flex-center mb-6 p-4 bg-white rounded-xl shadow-lg shadow-white/5" style={{ display: 'inline-flex' }}>
                <QRCodeSVG value={invoiceData.link} size={180} />
            </div>

            <div className="form-group text-left">
                <label className="text-label">Payment Link</label>
                <div className="flex-between gap-2">
                    <span className="input-field" style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                        {invoiceData.link}
                    </span>
                    <button
                        className="btn-secondary"
                        style={{ padding: '12px 16px' }}
                        onClick={handleCopy}
                    >
                        Copy
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-left">
                <div className="p-3 rounded-lg border border-gray-700 bg-black/20">
                    <span className="text-label" style={{ fontSize: '11px' }}>Hash</span>
                    <span className="font-mono text-blue-400 truncate block text-xs" title={invoiceData.hash}>
                        {invoiceData.hash.slice(0, 6)}...{invoiceData.hash.slice(-6)}
                    </span>
                </div>
                <div className="p-3 rounded-lg border border-gray-700 bg-black/20">
                    <span className="text-label" style={{ fontSize: '11px' }}>Salt</span>
                    <span className="font-mono text-purple-400 truncate block text-xs" title={invoiceData.salt}>
                        {invoiceData.salt.slice(0, 6)}...
                    </span>
                </div>
            </div>

            <button
                className="btn-secondary w-full"
                onClick={resetInvoice}
            >
                Create Another Invoice
            </button>
        </div>
    );
};

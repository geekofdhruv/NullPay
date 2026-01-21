import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CreateInvoice = () => {
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [expiry, setExpiry] = useState('0');
    const [createdInvoice, setCreatedInvoice] = useState<any>(null);

    const handleCreate = () => {
        // Mock creation logic
        setCreatedInvoice({
            hash: '0x123...abc',
            amount,
            memo,
            expiry
        });
    };

    return (
        <div className="page-container">
            <div className="flex-center flex-col text-center mb-8">
                <h1 className="text-gradient">Create Invoice</h1>
                <p className="text-label" style={{ fontSize: '18px' }}>Generate a privacy-preserving invoice for your customers.</p>
            </div>

            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <div className="glass-card mb-6">
                    <div className="form-group">
                        <label className="text-label">Amount (USDC)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-label">Memo (Optional)</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Order #1234 - Design Services"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
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

                    <button className="btn-primary mt-4" onClick={handleCreate}>
                        Generate Invoice Link
                    </button>
                </div>

                {createdInvoice && (
                    <div className="glass-card text-center" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        <h3 className="mb-4">Invoice Ready!</h3>
                        <div className="flex-center mb-6 p-4 bg-white rounded-xl" style={{ display: 'inline-flex' }}>
                            <QRCodeSVG value={`https://aleozkpay.com/pay/${createdInvoice.hash}`} size={180} />
                        </div>
                        <p className="text-label mb-2">Invoice Hash</p>
                        <div className="input-field mb-4 flex-between">
                            <span style={{ fontFamily: 'monospace' }}>{createdInvoice.hash}</span>
                            <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>COPY</span>
                        </div>
                        <button className="btn-secondary w-full">Share Link</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateInvoice;

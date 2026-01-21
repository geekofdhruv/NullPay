import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1); // 1: Connect, 2: Review, 3: Processing, 4: Success

    const invoice = {
        merchant: 'aleo1...9xyz',
        amount: '100 USDC',
        memo: 'Logo Design Work',
        expiry: '23h remaining'
    };

    const handlePay = () => {
        setStep(3);
        setTimeout(() => setStep(4), 3000);
    };

    return (
        <div className="page-container flex-center" style={{ minHeight: '80vh' }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>

                {/* STATUS HEADER */}
                <div className="text-center mb-8">
                    {step === 4 ? (
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                    ) : (
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>💸</div>
                    )}
                    <h1 className="text-gradient">
                        {step === 4 ? 'Payment Successful!' : 'Pay Invoice'}
                    </h1>
                </div>

                <div className="glass-card">
                    {/* INVOICE DETAILS */}
                    <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="flex-between mb-2">
                            <span className="text-label">Merchant</span>
                            <span className="text-value" style={{ fontFamily: 'monospace' }}>{invoice.merchant.slice(0, 10)}...</span>
                        </div>
                        <div className="flex-between mb-2">
                            <span className="text-label">Amount</span>
                            <span className="text-xl text-green">{invoice.amount}</span>
                        </div>
                        <div className="flex-between">
                            <span className="text-label">Memo</span>
                            <span className="text-value">{invoice.memo}</span>
                        </div>
                    </div>

                    {/* STEPS */}
                    {step === 4 ? (
                        <div className="text-center">
                            <p className="text-gray mb-6">The transaction has been settled on-chain verification.</p>
                            <button className="btn-primary">View Transaction</button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex-between mb-6">
                                <div className={`text-label ${step >= 1 ? 'text-green' : ''}`}>1. Connect</div>
                                <div className={`text-label ${step >= 2 ? 'text-green' : ''}`}>2. Appprove</div>
                                <div className={`text-label ${step >= 3 ? 'text-green' : ''}`}>3. Verify</div>
                            </div>

                            <button
                                className="btn-primary"
                                onClick={handlePay}
                                disabled={step === 3}
                            >
                                {step === 3 ? 'Processing Proof...' : 'Pay 100 USDC'}
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center mt-6 text-label" style={{ fontSize: '12px' }}>
                    Secured by Aleo Zero-Knowledge Proofs
                </p>

            </div>
        </div>
    );
};

export default PaymentPage;

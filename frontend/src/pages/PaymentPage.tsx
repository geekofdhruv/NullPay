import { usePayment, PaymentStep } from '../hooks/usePayment';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

const PaymentPage = () => {
    const {
        step,
        status,
        loading,
        error,
        invoice,
        txId,
        conversionTxId,
        payInvoice,
        convertPublicToPrivate
    } = usePayment();

    const { publicKey } = useWallet();

    const renderStepIndicator = () => {
        const steps: { key: PaymentStep; label: string }[] = [
            { key: 'CONNECT', label: '1. Connect' },
            { key: 'VERIFY', label: '2. Verify' },
            { key: 'PAY', label: '3. Pay' },
        ];

        // Map hook steps to UI steps
        // CONVERT is part of PAY flow visually or a sub-step? let's make it distinct if active.
        return (
            <div className="flex-between mb-6">
                {steps.map((s) => {
                    let isActive = false;
                    const currentIndex = steps.findIndex(x => x.key === step);
                    // Special handling: CONVERT is like step 2.5 or 3
                    if (step === 'CONVERT' && s.key === 'PAY') isActive = true;
                    if (step === 'SUCCESS' && s.key === 'PAY') isActive = true;
                    if (steps.findIndex(x => x.key === s.key) <= currentIndex) isActive = true;
                    // If we are past this step

                    return (
                        <span key={s.key} className={`text-label ${isActive ? 'text-highlight' : ''}`}>
                            {s.label}
                        </span>
                    );
                })}
            </div>
        );
    };

    if (error) {
        return (
            <div className="page-container flex-center">
                <div className="glass-card text-center border-red-500">
                    <h2 className="text-xl text-red-500 mb-4">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!invoice && loading) {
        return (
            <div className="page-container flex-center">
                <div className="text-center">
                    <div className="spinner mb-4"></div>
                    <p className="text-label">Verifying Invoice...</p>
                </div>
            </div>
        );
    }

    if (!invoice) return null; // Should have errored or loaded

    return (
        <div className="page-container flex-center" style={{ minHeight: '80vh' }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>

                {/* STATUS HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-gradient" style={{ fontSize: '36px' }}>
                        {step === 'SUCCESS' ? 'Transaction Submitted' : 'Pay Invoice'}
                    </h1>
                </div>

                <div className="glass-card">
                    {/* INVOICE DETAILS */}
                    <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="flex-between mb-2">
                            <span className="text-label">Merchant</span>
                            <span className="text-value" style={{ fontFamily: 'monospace' }}>
                                {invoice.merchant.slice(0, 8)}...{invoice.merchant.slice(-8)}
                            </span>
                        </div>
                        <div className="flex-between mb-2">
                            <span className="text-label">Amount</span>
                            <span className="text-xl text-highlight">{invoice.amount} Credits</span>
                        </div>
                        {invoice.memo && (
                            <div className="flex-between">
                                <span className="text-label">Memo</span>
                                <span className="text-value">{invoice.memo}</span>
                            </div>
                        )}
                        <div className="flex-between mt-2">
                            <span className="text-label">Verified Hash</span>
                            <span className="text-green-400 text-xs">✓ Match</span>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    {step === 'SUCCESS' ? (
                        <div className="text-center">
                            <div className="mb-6">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <p className="text-small mb-6">The transaction has been broadcasted.</p>
                            <div className="glass-card bg-opacity-20 mb-6 break-all text-xs font-mono">
                                {txId}
                            </div>

                            {txId?.startsWith('at1') ? (
                                <button className="btn-secondary" onClick={() => window.open(`https://testnet.explorer.provable.com/transaction/${txId}`, '_blank')}>
                                    View on Explorer
                                </button>
                            ) : (
                                <p className="text-xs text-gray-400">
                                    Transaction broadcasted. This ID is a wallet receipt. <br />
                                    Please check your wallet history for the on-chain Transaction ID.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div>
                            {renderStepIndicator()}

                            <div className="min-h-[60px] flex-center flex-col">
                                {status && <p className="text-label text-xs mb-4 text-center">{status}</p>}

                                {!publicKey ? (
                                    <WalletMultiButton />
                                ) : (
                                    <>
                                        {step === 'CONVERT' ? (
                                            <div className="text-center">
                                                {!conversionTxId ? (
                                                    <>
                                                        <div className="alert-warning mb-4">
                                                            Insufficient Private Credits.
                                                            <br />
                                                            Convert Public Credits to pay privately?
                                                        </div>
                                                        <button
                                                            className="btn-primary"
                                                            onClick={convertPublicToPrivate}
                                                            disabled={loading}
                                                        >
                                                            {loading ? 'Converting...' : 'Convert Public -> Private'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="fade-in-up">
                                                        <div className="mb-4">
                                                            <span className="text-2xl">⏳</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold mb-2">Conversion Broadcasted</h3>
                                                        <p className="text-small mb-4">
                                                            Please wait for the transaction to settle on-chain.
                                                        </p>
                                                        <div className="glass-card bg-opacity-20 mb-6 p-3 text-xs font-mono break-all border border-white/10">
                                                            TxID: {conversionTxId}
                                                        </div>
                                                        <button
                                                            className="btn-primary w-full"
                                                            onClick={() => {
                                                                // Just retry paying. If records are found, it proceeds.
                                                                // If not, it stays here (or re-checks).
                                                                // Ideally we trigger a check. calling payInvoice triggers a check.
                                                                payInvoice();
                                                            }}
                                                        >
                                                            Check Records & Pay →
                                                        </button>
                                                        <a
                                                            href={`https://testnet.explorer.provable.com/transaction/${conversionTxId}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="block mt-4 text-xs text-primary hover:underline"
                                                        >
                                                            Check Status on Explorer
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                onClick={payInvoice}
                                                disabled={loading || step === 'CONNECT'}
                                            >
                                                {loading ? 'Processing...' : `Pay ${invoice.amount} Credits`}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
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

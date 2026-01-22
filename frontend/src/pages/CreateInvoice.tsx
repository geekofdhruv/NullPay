import React from 'react';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import { InvoiceForm } from '../components/invoice/InvoiceForm';
import { InvoiceCard } from '../components/invoice/InvoiceCard';

export const CreateInvoice: React.FC = () => {
    const {
        amount, setAmount,
        expiry, setExpiry,
        memo, setMemo,
        status, loading,
        invoiceData,
        handleCreate,
        resetInvoice,
        publicKey
    } = useCreateInvoice();

    return (
        <div className="page-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="flex-center flex-col text-center mb-6 fade-in-up">
                <h1 className="text-gradient">Create Invoice</h1>
                {!invoiceData && (
                    <p className="text-label" style={{ fontSize: '18px', textTransform: 'none' }}>
                        Generate a privacy-preserving invoice for your customers.
                    </p>
                )}
            </div>

            <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }} className="fade-in-up delay-100">
                {!invoiceData ? (
                    <InvoiceForm
                        amount={amount}
                        setAmount={setAmount}
                        expiry={expiry}
                        setExpiry={setExpiry}
                        memo={memo}
                        setMemo={setMemo}
                        handleCreate={handleCreate}
                        loading={loading}
                        publicKey={publicKey}
                        status={status}
                    />
                ) : (
                    <InvoiceCard
                        invoiceData={invoiceData}
                        resetInvoice={resetInvoice}
                        expiry={expiry}
                        memo={memo}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateInvoice;

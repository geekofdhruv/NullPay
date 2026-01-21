const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Invoice {
    invoice_hash: string;
    status: 'PENDING' | 'SETTLED';
    block_height: number;
    block_settled?: number;
    transaction_id?: string;
    created_at?: string;
}

export const fetchInvoices = async (status?: string): Promise<Invoice[]> => {
    const url = new URL(`${API_URL}/invoices`);
    if (status) {
        url.searchParams.append('status', status);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Failed to fetch invoices');
    }
    return response.json();
};

export const fetchInvoiceByHash = async (hash: string): Promise<Invoice> => {
    const response = await fetch(`${API_URL}/invoice/${hash}`);
    if (!response.ok) {
        throw new Error('Failed to fetch invoice');
    }
    return response.json();
};

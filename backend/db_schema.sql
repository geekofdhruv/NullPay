-- Create the invoices table
CREATE TABLE IF NOT EXISTS invoices (
    invoice_hash TEXT PRIMARY KEY,
    status TEXT NOT NULL,          -- 'PENDING', 'SETTLED'
    block_height INTEGER NOT NULL,
    block_settled INTEGER,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_block_height ON invoices(block_height);

-- Optional: Insert dummy data for testing
INSERT INTO invoices (invoice_hash, status, block_height, transaction_id)
VALUES 
('0x123abcfakehash', 'PENDING', 1005, NULL),
('0x456deffakehash', 'SETTLED', 900, 'at1transactionid...')
ON CONFLICT (invoice_hash) DO NOTHING;

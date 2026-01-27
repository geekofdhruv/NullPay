-- CRITICAL FIX: Allow block_height to be nullable
-- This is required because new invoices are saved before they are mined into a block.
ALTER TABLE invoices ALTER COLUMN block_height DROP NOT NULL;

-- 1. Add new columns if they don't exist
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS merchant_address TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payer_address TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS amount NUMERIC;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS memo TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_transaction_id TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_tx_id TEXT;

-- 2. Add indexes
CREATE INDEX IF NOT EXISTS idx_merchant_address ON invoices(merchant_address);
CREATE INDEX IF NOT EXISTS idx_payer_address ON invoices(payer_address);
CREATE INDEX IF NOT EXISTS idx_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_transaction_id ON invoices(invoice_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_id ON invoices(payment_tx_id);

-- 3. Mock Data Seeding
-- We are inserting records. block_height is omitted for PENDING (so it's null), and provided for SETTLED.
INSERT INTO invoices (invoice_hash, status, amount, memo, merchant_address, invoice_transaction_id, block_height, created_at, updated_at)
VALUES 
-- Pending invoice (Block height is NULL)
('1234567890abcdef1234567890abcdef', 'PENDING', 150, 'Consulting Services', 'aleo1y90...mock1', 'at1mocktxid123456789', NULL, NOW(), NOW()),

-- Settled invoices (Block height has value)
('abcdef1234567890abcdef1234567890', 'SETTLED', 500, 'Web Design Project', 'aleo1y90...mock1', 'at1mocktxid987654321', 123456, NOW() - INTERVAL '1 day', NOW()),
('aaaabbbbccccddddeeeeffff00001111', 'SETTLED', 25.50, 'Coffee & Snacks', 'aleo1y90...mock2', 'at1mocktxid555555555', 123460, NOW() - INTERVAL '2 hours', NOW()),
('99998888777766665555444433332222', 'PENDING', 1200, 'Monthly Retainer', 'aleo1y90...mock1', 'at1mocktxid444444444', NULL, NOW() - INTERVAL '3 days', NOW()),
('11112222333344445555666677778888', 'SETTLED', 99.99, 'Software License', 'aleo1y90...mock3', 'at1mocktxid333333333', 123400, NOW() - INTERVAL '1 week', NOW());

-- Add a payment transaction ID for the settled ones
UPDATE invoices 
SET payment_tx_id = 'at1mockpaymenttxid001' 
WHERE invoice_hash = 'abcdef1234567890abcdef1234567890';

UPDATE invoices 
SET payment_tx_id = 'at1mockpaymenttxid002' 
WHERE invoice_hash = 'aaaabbbbccccddddeeeeffff00001111';

UPDATE invoices 
SET payment_tx_id = 'at1mockpaymenttxid003' 
WHERE invoice_hash = '11112222333344445555666677778888';

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Routes ---

// Health Check
app.get('/', (req, res) => {
    res.send('AleoZKPay Backend is running');
});

// GET /api/invoices
// Fetch all invoices (optionally filter by status)
app.get('/api/invoices', async (req, res) => {
    const { status } = req.query;
    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching invoices:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// GET /api/invoice/:hash
// Fetch a single invoice by hash
app.get('/api/invoice/:hash', async (req, res) => {
    const { hash } = req.params;

    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_hash', hash)
        .single();

    if (error) {
        console.error('Error fetching invoice:', error);
        return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(data);
});

// POST /api/sync-event (Mock for Chain Listener)
// This endpoint would be called by a local node listener or cron job
app.post('/api/sync-event', async (req, res) => {
    const { invoice_hash, status, block_height, transaction_id } = req.body;

    if (!invoice_hash || !status || !block_height) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert invoice data
    const { data, error } = await supabase
        .from('invoices')
        .upsert({
            invoice_hash,
            status,
            block_height,
            transaction_id,
            updated_at: new Date().toISOString()
        })
        .select();

    if (error) {
        console.error('Error syncing event:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
});

// --- Start Server ---

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Supabase URL: ${supabaseUrl}`);
});

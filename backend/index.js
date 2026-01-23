const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
app.get('/', (req, res) => {
    res.send('AleoZKPay Backend is running');
});

app.get('/api/invoices', async (req, res) => {
    const { status, merchant } = req.query;
    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }
    if (merchant) {
        query = query.eq('merchant', merchant);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching invoices:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

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

app.post('/api/hash-invoice', async (req, res) => {
    const { merchant, amount, salt } = req.body;

    if (!merchant || !amount || !salt) {
        return res.status(400).json({ error: 'Missing required fields: merchant, amount, salt' });
    }

    try {
        const { createInvoiceHash } = require('./aleo-utils');
        const hash = await createInvoiceHash(merchant, amount, salt);
        res.json({ hash });
    } catch (error) {
        console.error('Error computing hash:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sync-event', async (req, res) => {
    const { invoice_hash, status, block_height, transaction_id, merchant, amount, memo } = req.body;

    if (!invoice_hash || !status || block_height === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
        .from('invoices')
        .upsert({
            invoice_hash,
            status,
            block_height,
            transaction_id,
            merchant,       // Store merchant
            amount,         // Store amount
            memo,           // Store memo
            updated_at: new Date().toISOString()
        })
        .select();

    if (error) {
        console.error('Error syncing event:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Supabase URL: ${supabaseUrl}`);
});

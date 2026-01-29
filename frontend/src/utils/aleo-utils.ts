// Aleo SDK / Helper functions
// Ideally, these would use the @provablehq/sdk, but for now we mock or use basic string ops
// since we assume the wallet adapter handles the heavy lifting for signing/proving.

// NEW: Use Singular V7 Contract
export const PROGRAM_ID = "zk_pay_proofs_privacy_v7.aleo";

export const generateSalt = (): string => {
    const randomBuffer = new Uint8Array(16);
    crypto.getRandomValues(randomBuffer);
    let randomBigInt = BigInt(0);
    for (const byte of randomBuffer) {
        randomBigInt = (randomBigInt << 8n) + BigInt(byte);
    }
    return `${randomBigInt}field`;
};
export const getInvoiceHashFromMapping = async (salt: string): Promise<string | null> => {
    console.log(`Checking salt mapping for ${salt}...`);
    try {
        const url = `https://api.provable.com/v2/testnet/program/${PROGRAM_ID}/mapping/salt_to_invoice/${salt}`;
        const res = await fetch(url);
        if (res.ok) {
            const val = await res.json();
            if (val) return val.toString().replace(/(['"])/g, '');
        }
    } catch (e) { console.error(e); }
    return null;
};

export const getInvoiceStatus = async (hash: string): Promise<number | null> => {
    console.log(`Checking invoice status for hash ${hash}...`);
    try {
        const url = `https://api.provable.com/v2/testnet/program/${PROGRAM_ID}/mapping/invoices/${hash}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data) {
                const statusStr = data.status;
                if (typeof statusStr === 'string') return parseInt(statusStr.replace('u8', ''));
                if (typeof statusStr === 'number') return statusStr;
            }
        }
    } catch (e) { console.error(e); }
    return null;
};
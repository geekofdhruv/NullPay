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
        const programId = 'zk_pay_proofs_privacy_v6.aleo';
        const mappingName = 'salt_to_invoice';
        const url = `https://api.provable.com/v2/testnet/program/${programId}/mapping/${mappingName}/${salt}`;

        const response = await fetch(url);
        if (!response.ok) return null;

        const val = await response.json();

        if (val === null) {
            console.warn("Mapping returned 200 OK but value is null (Key not found).");
            return null;
        }

        if (val) {
            console.log("✅ Found Hash via On-Chain Mapping!");
            return val.toString().replace(/(['"])/g, '');
        }
    } catch (e) {
        console.warn("Mapping lookup failed:", e);
    }
    return null;
};

export const getInvoiceStatus = async (hash: string): Promise<number | null> => {
    console.log(`Checking invoice status for hash ${hash}...`);
    try {
        const programId = 'zk_pay_proofs_privacy_v6.aleo';
        const mappingName = 'invoices';
        const url = `https://api.provable.com/v2/testnet/program/${programId}/mapping/${mappingName}/${hash}`;

        const response = await fetch(url);
        if (!response.ok) return null;

        const val = await response.json();
        console.log("Invoice Data Raw:", val);

        if (typeof val === 'string') {
            const match = val.match(/status:\s*(\d+)u8/);
            if (match && match[1]) {
                return parseInt(match[1]);
            }
        } else if (typeof val === 'object' && val !== null) {
            // Handle if API returns direct JSON object
            if ('status' in val) {
                // Check if it's a number or a string like "1u8"
                const statusVal = val.status;
                if (typeof statusVal === 'number') return statusVal;
                if (typeof statusVal === 'string') {
                    return parseInt(statusVal.replace('u8', ''));
                }
            }
        }

        return null;
    } catch (e) {
        console.warn("Invoice status lookup failed:", e);
        return null;
    }
};
const { BHP256, Address, Field, U64 } = require('@provablehq/sdk');

/**
 * Computes the invoice hash using the Aleo SDK (server-side).
 * @param {string} merchant - Merchant address (e.g., aleo1...)
 * @param {number} amount - Amount in u64
 * @param {string} salt - Random salt field
 * @returns {Promise<string>} The computed hash field
 */
async function createInvoiceHash(merchant, amount, salt) {
    try {
        console.log('Computing invoice hash (BHP256 Summation)...');
        const hasher = new BHP256();
        console.log(`Parsing inputs: Merchant=${merchant}, Amount=${amount}, Salt=${salt}`);

        const merchantAddr = Address.from_string(merchant);
        const amountU64 = U64.fromString(`${amount}u64`);
        const saltField = Field.fromString(salt);

        const hashMerchant = hasher.hash(merchantAddr.toBitsLe());
        const hashAmount = hasher.hash(amountU64.toBitsLe());
        const hashSalt = hasher.hash(saltField.toBitsLe());

        const finalHash = hashMerchant.add(hashAmount).add(hashSalt);

        const result = finalHash.toString();
        console.log("Hash computed:", result);
        return result;

    } catch (error) {
        console.error("Error computing hash:", error);
        throw error;
    }
}

module.exports = { createInvoiceHash };

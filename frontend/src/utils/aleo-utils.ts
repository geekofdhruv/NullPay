import { Poseidon2, Address, Field } from '@provablehq/sdk';

export const generateSalt = (): string => {
    console.log('generateSalt function called');

    const randomBuffer = new Uint8Array(16);
    crypto.getRandomValues(randomBuffer);
    let randomBigInt = BigInt(0);
    for (const byte of randomBuffer) {
        randomBigInt = (randomBigInt << 8n) + BigInt(byte);
    }
    console.log('generateSalt function returned');
    return `${randomBigInt}field`;
};

export const createInvoiceHash = async (merchant: string, amount: number, salt: string): Promise<string> => {
    try {
        console.log('Computing invoice hash (Poseidon2)...');
        const hasher = new Poseidon2();
        console.log(`Parsing inputs: Merchant=${merchant}, Amount=${amount}, Salt=${salt}`);
        const merchantAddr = Address.from_string(merchant);

        const microcredits = Math.round(amount * 1_000_000);

        // Convert to Fields for Poseidon Hashing
        // 1. Merchant Address -> Field[]
        const merchantFields = merchantAddr.toFields();

        // 2. Amount -> Field (Leo casts u64 to field for hashing)
        const amountField = Field.fromString(`${microcredits}field`);

        // 3. Salt -> Field
        const saltField = Field.fromString(salt);

        // Hash each component
        // Note: hasher.hash() returns a Field object directly (based on linter feedback)
        const hashMerchant = hasher.hash(merchantFields);
        const hashAmount = hasher.hash([amountField]); // Hash single field array
        const hashSalt = hasher.hash([saltField]);

        const finalHash = hashMerchant.add(hashAmount).add(hashSalt);
        const result = finalHash.toString();
        console.log("Hash computed:", result);
        return result;
    } catch (error) {
        console.error("Error computing hash:", error);
        throw error;
    }
};

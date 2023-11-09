export const TEST_ACCOUNT = process.env.PAYTRAIL_TEST_ACCOUNT as string;
export const TEST_SECRET = process.env.PAYTRAIL_TEST_SECRET as string;

import crypto from 'crypto';

/**
 * Calculate HMAC
 *
 * @param {string} secret Merchant shared secret
 * @param {object} params Headers or query string parameters
 * @param {object|undefined} body Request body or empty string for GET requests
 */
export type CheckoutParams = {
    [key: string]: string;
};

export const calculateHmac = (secret: string, params: CheckoutParams, body: object | undefined) => {
    const hmacPayload = Object.keys(params)
        .sort()
        .map((key) => [key, params[key]].join(':'))
        .concat(body ? JSON.stringify(body) : '')
        .join('\n');

    return crypto.createHmac('sha256', secret).update(hmacPayload).digest('hex');
};

export const guidv4 = (data?: Uint8Array): string => {
    // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
    data = data || crypto.getRandomValues(new Uint8Array(16));

    // Set version to 0100
    data[6] = (data[6] & 0x0f) | 0x40;
    // Set bits 6-7 to 10
    data[8] = (data[8] & 0x3f) | 0x80;

    // Output the 36 character UUID.
    return `${toHex(data.subarray(0, 4))}-${toHex(data.subarray(4, 6))}-${toHex(data.subarray(6, 8))}-${toHex(data.subarray(8, 10))}-${toHex(data.subarray(10, 16))}`;
};

const toHex = (buffer: Uint8Array): string => {
    return Array.from(buffer)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

import axios from 'axios';
import crypto from 'crypto';

//import { handleError } from '../util/error_handler';
import { isObject } from '../types/type_functions';

const API_ENDPOINT = 'https://services.paytrail.com';
const ACCOUNT = process.env.PAYTRAIL_TEST_ACCOUNT as string;
const SECRET = process.env.PAYTRAIL_TEST_SECRET as string;

const guidv4 = (data?: Uint8Array): string => {
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

interface PaytrailResponse {
    success: boolean;
    data: object;
    message: string;
}

/**
 * Calculate HMAC
 *
 * @param {string} secret Merchant shared secret
 * @param {object} params Headers or query string parameters
 * @param {object|undefined} body Request body or empty string for GET requests
 */
type Params = {
    [key: string]: string;
};

const calculateHmac = (secret: string, params: Params, body: object | undefined) => {
    const hmacPayload = Object.keys(params)
        .sort()
        .map((key) => [key, params[key]].join(':'))
        .concat(body ? JSON.stringify(body) : '')
        .join('\n');

    return crypto.createHmac('sha256', secret).update(hmacPayload).digest('hex');
};

const testPaymentRequest = async (): Promise<PaytrailResponse> => {
    try {
        const orderNumber: string = new Date().toISOString() + 'nonce';
        const timeStamp = new Date().toISOString();

        const headersForHmac = {
            'checkout-account': ACCOUNT,
            'checkout-algorithm': 'sha256',
            'checkout-method': 'POST',
            'checkout-nonce': orderNumber,
            'checkout-timestamp': timeStamp,
        };

        const body = {
            stamp: guidv4(),
            reference: orderNumber,
            amount: 1525,
            currency: 'EUR',
            language: 'FI',
            items: [
                {
                    unitPrice: 1525,
                    units: 1,
                    vatPercentage: 24,
                    productCode: '#1234',
                    deliveryDate: '2018-09-01',
                },
            ],
            customer: {
                email: 'test.customer@example.com',
            },
            redirectUrls: {
                success: 'https://tempurlfullstack.com/success',
                cancel: 'https://tempurlfullstack.com/payment',
            },
            callbackUrls: {
                success: 'https://tempurlfullstack.com/success',
                cancel: 'https://tempurlfullstack.com/payment',
            },
        };

        const hmac = calculateHmac(SECRET, headersForHmac, body);
        const headers = { ...headersForHmac, 'content-type': 'application/json; charset=utf-8', signature: hmac };

        const res = await axios.post(API_ENDPOINT + '/payments', body, { headers });

        if ('data' in res && res.data && isObject(res.data)) {
            return { success: true, data: res.data, message: 'Ok' };
        } else {
            return { success: false, data: {}, message: 'Something went wrong' };
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('error.response.data:', error.response.data);
                console.error('error.response.status:', error.response.status);
                console.error('error.response.headers:', error.response.headers);
            } else if (error.request) {
                console.error('error.request:', error.request);
            } else {
                console.error('error.message:', error.message);
            }
        } else {
            console.error('Non-Axios Error:', error);
        }
        return {
            success: false,
            data: {},
            message:
                'Error occurred' +
                (error instanceof Error
                    ? ': ' + (axios.isAxiosError(error) && error.response && isObject(error.response.data) && 'message' in error.response.data ? error.response.data.message : error.message)
                    : ''),
        };
    }
};

export default {
    testPaymentRequest,
};

import axios from 'axios';
import crypto from 'crypto';

import { handleError } from '../util/error_handler';
import { isObject } from '../types/type_functions';

const API_ENDPOINT = 'https://services.paytrail.com';
const ACCOUNT = process.env.PAYTRAIL_TEST_ACCOUNT;
const SECRET = process.env.PAYTRAIL_TEST_SECRET;

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

const headers = {
    'checkout-account': ACCOUNT as string,
    'checkout-algorithm': 'sha256',
    'checkout-method': 'POST',
    'checkout-nonce': '564635208570151',
    'checkout-timestamp': '2018-07-06T10:01:31.904Z',
    'content-type': 'application/json; charset=utf-8',
};

const body = {
    stamp: 'unique-identifier-for-merchant',
    reference: '3759170',
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
        success: 'https://ecom.example.com/cart/success',
        cancel: 'https://ecom.example.com/cart/cancel',
    },
};

const testHmacCalculation = () => {
    if (SECRET) {
        // Expected HMAC: 3708f6497ae7cc55a2e6009fc90aa10c3ad0ef125260ee91b19168750f6d74f6
        return {
            expected__: '3708f6497ae7cc55a2e6009fc90aa10c3ad0ef125260ee91b19168750f6d74f6',
            calculated: calculateHmac(SECRET, headers, body),
        };
    } else {
        return { error: 'SECRET is undefined' };
    }
};

const testPaymentRequest = async (): Promise<PaytrailResponse> => {
    try {
        const hmac = calculateHmac(SECRET as string, headers, body);
        const res = await axios.post(API_ENDPOINT + '/payments', body, { headers: { ...headers, signature: hmac } });
        if (res.data && isObject(res.data)) {
            return { success: true, data: res.data, message: 'Ok' };
        } else {
            return { success: false, data: {}, message: 'Something went wrong' };
        }
    } catch (err) {
        handleError(err);
        return { success: false, data: {}, message: 'Error occurred' + (err instanceof Error ? ': ' + err.message : '') };
    }
};

export default {
    testHmacCalculation,
    testPaymentRequest,
};

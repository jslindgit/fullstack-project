import axios from 'axios';

import { CheckoutParams } from '../util/paytrailProvider';
import { OrderInstance } from '../models/order';

import { calculateHmac, guidv4, TEST_ACCOUNT, TEST_SECRET } from '../util/paytrailProvider';
import { handleError } from '../util/error_handler';
import { isObject } from '../types/type_functions';

const API_ENDPOINT = 'https://services.paytrail.com';

interface PaytrailResponse {
    success: boolean;
    message: string;
    data: object;
}

const paymentRequest = async (order: OrderInstance): Promise<PaytrailResponse> => {
    try {
        const timeStamp = new Date().toISOString();

        const headersForHmac: CheckoutParams = {
            'checkout-account': TEST_ACCOUNT,
            'checkout-algorithm': 'sha256',
            'checkout-method': 'POST',
            'checkout-nonce': order.id.toString(),
            'checkout-timestamp': timeStamp,
        };

        interface ShoppingItem {
            id: number;
            name: string;
            price: number;
            quantity: number;
        }

        const items: ShoppingItem[] = JSON.parse(order.items) as ShoppingItem[];

        const productionUrl = 'https://fullstack-open-project.onrender.com';

        const body = {
            stamp: guidv4(),
            reference: order.id.toString(),
            amount: order.totalAmount * 100, // in currency's minor units, e.g. for Euros in cents
            currency: order.currency,
            language: order.language,
            orderId: order.id.toString(),
            items: items.map((item) => ({
                unitPrice: item.price * 100,
                units: item.quantity,
                vatPercentage: 24,
                productCode: item.id.toString(),
            })),
            customer: {
                email: order.customerEmail,
                firstName: order.customerFirstName,
                lastName: order.customerLastName,
                phone: order.customerPhone,
                companyName: order.customerOrganization ? order.customerOrganization : '',
            },
            invoicingAddress: {
                streetAddress: order.customerAddress,
                postalCode: order.customerZipCode,
                city: order.customerCity,
                country: order.customerCountry,
            },
            // The Paytrail API doesn't accept 'http://localhost:3000/*' URL's as return URL values,
            // so when testing, the 'https://www.mockreturnurl.fi/*' must be changed to 'http://localhost:3000/*' manually in browser's address field:
            redirectUrls: {
                success: process.env.NODE_ENV === 'dev' ? 'https://www.mockreturnurl.fi/success' : productionUrl + '/success',
                cancel: process.env.NODE_ENV === 'dev' ? 'https://www.mockreturnurl.fi/cancel' : productionUrl + '/payment',
            },
            callbackUrls: {
                success: process.env.NODE_ENV === 'dev' ? 'https://www.mockreturnurl.fi/success' : productionUrl + '/success',
                cancel: process.env.NODE_ENV === 'dev' ? 'https://www.mockreturnurl.fi/payment' : productionUrl + '/payment',
            },
        };

        const hmac = calculateHmac(TEST_SECRET, headersForHmac, body);
        const headers = { ...headersForHmac, 'content-type': 'application/json; charset=utf-8', signature: hmac };

        const res = await axios.post(API_ENDPOINT + '/payments', body, { headers });

        if ('data' in res && res.data && isObject(res.data)) {
            return { success: true, data: res.data, message: 'Ok' };
        } else {
            return { success: false, data: {}, message: 'Something went wrong' };
        }
    } catch (error: unknown) {
        handleError(error);

        return {
            success: false,
            data: {},
            message:
                'Error occurred' +
                (error instanceof Error
                    ? ': ' +
                      (axios.isAxiosError(error) && error.response && isObject(error.response.data) && 'message' in error.response.data
                          ? error.response.data.message
                          : error.message)
                    : ''),
        };
    }
};

const validateSignatureFromUrl = (url: string) => {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    const checkoutParams: CheckoutParams = {};

    params.forEach((value, key) => {
        if (key.startsWith('checkout-')) {
            checkoutParams[key] = value;
        }
    });

    const hmac = calculateHmac(TEST_SECRET, checkoutParams, undefined);

    return hmac === params.get('signature');
};

const testPaymentRequest = async (): Promise<PaytrailResponse> => {
    try {
        const orderNumber: string = new Date().toISOString() + 'nonce';
        const timeStamp = new Date().toISOString();

        const headersForHmac = {
            'checkout-account': TEST_ACCOUNT,
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
                success: 'https://fullstack-open-project.onrender.com/success',
                cancel: 'https://fullstack-open-project.onrender.com/payment',
            },
            callbackUrls: {
                success: 'https://fullstack-open-project.onrender.com/success',
                cancel: 'https://fullstack-open-project.onrender.com/payment',
            },
        };

        const hmac = calculateHmac(TEST_SECRET, headersForHmac, body);
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
                    ? ': ' +
                      (axios.isAxiosError(error) && error.response && isObject(error.response.data) && 'message' in error.response.data
                          ? error.response.data.message
                          : error.message)
                    : ''),
        };
    }
};

export default {
    paymentRequest,
    testPaymentRequest,
    validateSignatureFromUrl,
};

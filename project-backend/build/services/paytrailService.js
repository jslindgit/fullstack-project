"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const paytrailProvider_1 = require("../util/paytrailProvider");
const error_handler_1 = require("../util/error_handler");
const type_functions_1 = require("../types/type_functions");
const API_ENDPOINT = 'https://services.paytrail.com';
const paymentRequest = async (order) => {
    try {
        const timeStamp = new Date().toISOString();
        const headersForHmac = {
            'checkout-account': paytrailProvider_1.TEST_ACCOUNT,
            'checkout-algorithm': 'sha256',
            'checkout-method': 'POST',
            'checkout-nonce': order.id.toString(),
            'checkout-timestamp': timeStamp,
        };
        const items = JSON.parse(order.items);
        const body = {
            stamp: (0, paytrailProvider_1.guidv4)(),
            reference: order.id.toString(),
            amount: order.totalAmount * 100,
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
            redirectUrls: {
                success: 'https://tempurlfullstack.com/success',
                cancel: 'https://tempurlfullstack.com/payment',
            },
            callbackUrls: {
                success: 'https://tempurlfullstack.com/success',
                cancel: 'https://tempurlfullstack.com/payment',
            },
        };
        const hmac = (0, paytrailProvider_1.calculateHmac)(paytrailProvider_1.TEST_SECRET, headersForHmac, body);
        const headers = { ...headersForHmac, 'content-type': 'application/json; charset=utf-8', signature: hmac };
        const res = await axios_1.default.post(API_ENDPOINT + '/payments', body, { headers });
        if ('data' in res && res.data && (0, type_functions_1.isObject)(res.data)) {
            return { success: true, data: res.data, message: 'Ok' };
        }
        else {
            return { success: false, data: {}, message: 'Something went wrong' };
        }
    }
    catch (error) {
        (0, error_handler_1.handleError)(error);
        return {
            success: false,
            data: {},
            message: 'Error occurred' +
                (error instanceof Error
                    ? ': ' +
                        (axios_1.default.isAxiosError(error) && error.response && (0, type_functions_1.isObject)(error.response.data) && 'message' in error.response.data
                            ? error.response.data.message
                            : error.message)
                    : ''),
        };
    }
};
const validateSignatureFromUrl = (url) => {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    const checkoutParams = {};
    params.forEach((value, key) => {
        if (key.startsWith('checkout-')) {
            checkoutParams[key] = value;
        }
    });
    const hmac = (0, paytrailProvider_1.calculateHmac)(paytrailProvider_1.TEST_SECRET, checkoutParams, undefined);
    console.log('hmac:', hmac);
    console.log('usig:', params.get('signature'));
    return hmac === params.get('signature');
};
const testPaymentRequest = async () => {
    try {
        const orderNumber = new Date().toISOString() + 'nonce';
        const timeStamp = new Date().toISOString();
        const headersForHmac = {
            'checkout-account': paytrailProvider_1.TEST_ACCOUNT,
            'checkout-algorithm': 'sha256',
            'checkout-method': 'POST',
            'checkout-nonce': orderNumber,
            'checkout-timestamp': timeStamp,
        };
        const body = {
            stamp: (0, paytrailProvider_1.guidv4)(),
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
        const hmac = (0, paytrailProvider_1.calculateHmac)(paytrailProvider_1.TEST_SECRET, headersForHmac, body);
        const headers = { ...headersForHmac, 'content-type': 'application/json; charset=utf-8', signature: hmac };
        const res = await axios_1.default.post(API_ENDPOINT + '/payments', body, { headers });
        if ('data' in res && res.data && (0, type_functions_1.isObject)(res.data)) {
            return { success: true, data: res.data, message: 'Ok' };
        }
        else {
            return { success: false, data: {}, message: 'Something went wrong' };
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                console.error('error.response.data:', error.response.data);
                console.error('error.response.status:', error.response.status);
                console.error('error.response.headers:', error.response.headers);
            }
            else if (error.request) {
                console.error('error.request:', error.request);
            }
            else {
                console.error('error.message:', error.message);
            }
        }
        else {
            console.error('Non-Axios Error:', error);
        }
        return {
            success: false,
            data: {},
            message: 'Error occurred' +
                (error instanceof Error
                    ? ': ' +
                        (axios_1.default.isAxiosError(error) && error.response && (0, type_functions_1.isObject)(error.response.data) && 'message' in error.response.data
                            ? error.response.data.message
                            : error.message)
                    : ''),
        };
    }
};
exports.default = {
    paymentRequest,
    testPaymentRequest,
    validateSignatureFromUrl,
};

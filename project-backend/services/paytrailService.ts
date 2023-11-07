import axios from 'axios';
import { Op } from 'sequelize';

import Order, { NewOrder, OrderInstance } from '../models/order';

import { calculateHmac, guidv4, TEST_ACCOUNT, TEST_SECRET } from '../util/paytrailProvider';
import { handleError } from '../util/error_handler';
import { isObject } from '../types/type_functions';

const API_ENDPOINT = 'https://services.paytrail.com';

interface PaytrailResponse {
    success: boolean;
    message: string;
    data: object;
}

interface OrderResponse {
    success: boolean;
    message: string;
    order: OrderInstance | null;
}

const addNew = async (newOrder: NewOrder): Promise<OrderResponse> => {
    try {
        console.log('newOrder:', newOrder);
        const order = await Order.create(newOrder);
        await order.save();
        return { success: true, message: 'Ok', order: order };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' + (err instanceof Error ? ': ' + err.message : ''), order: null };
    }
};

const getAll = async (searchQuery: string = ''): Promise<OrderInstance[]> => {
    try {
        let where = {};
        if (searchQuery && searchQuery.length > 0) {
            where = {
                [Op.or]: [
                    {
                        id: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        customerFirstName: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        customerLastName: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }

        const orders = await Order.findAll({
            where,
            order: [['created_at', 'DESC']],
        });

        return orders;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const paymentRequest = async (newOrder: NewOrder): Promise<PaytrailResponse> => {
    try {
        const orderResponse = await addNew(newOrder);

        if (!orderResponse.success || !orderResponse.order) {
            return { success: false, message: orderResponse.message, data: {} };
        }

        const order = orderResponse.order;

        const timeStamp = new Date().toISOString();

        const headersForHmac = {
            'checkout-account': TEST_ACCOUNT,
            'checkout-algorithm': 'sha256',
            'checkout-method': 'POST',
            'checkout-nonce': order.id.toString(),
            'checkout-timestamp': timeStamp,
        };

        interface ItemAttributes {
            itemId: number;
            name: string;
            price: number;
            quantity: number;
        }

        const items: ItemAttributes[] = JSON.parse(order.items) as ItemAttributes[];

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
                productCode: item.itemId.toString(),
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
                    ? ': ' + (axios.isAxiosError(error) && error.response && isObject(error.response.data) && 'message' in error.response.data ? error.response.data.message : error.message)
                    : ''),
        };
    }
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
                success: 'https://tempurlfullstack.com/success',
                cancel: 'https://tempurlfullstack.com/payment',
            },
            callbackUrls: {
                success: 'https://tempurlfullstack.com/success',
                cancel: 'https://tempurlfullstack.com/payment',
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
                    ? ': ' + (axios.isAxiosError(error) && error.response && isObject(error.response.data) && 'message' in error.response.data ? error.response.data.message : error.message)
                    : ''),
        };
    }
};

export default {
    getAll,
    paymentRequest,
    testPaymentRequest,
};

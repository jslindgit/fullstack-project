import axios from 'axios';

import { Config } from '../types/configTypes';
import { NewOrder, Order, PaytrailData } from '../types/orderTypes';
import { Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { apiKeyConfig } from '../util/serviceProvider';
import { handleError } from '../util/handleError';
import { orderToRequestBody } from '../types/orderTypeFunctions';

interface PaytrailResponse extends Response {
    data: PaytrailData | null;
}

const url = apiBaseUrl + '/paytrail';

const createPayment = async (order: NewOrder | Order, config: Config): Promise<PaytrailResponse> => {
    try {
        const res = await axios.post<PaytrailData>(url + '/payment', orderToRequestBody(order, config));

        if (res.status === 200) {
            return { success: true, message: 'Ok', data: res.data };
        } else {
            return { success: false, message: `Something went wrong (${res.status})`, data: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', data: null };
    }
};

const createTestPayment = async (): Promise<PaytrailResponse> => {
    try {
        const res = await axios.get<PaytrailData>(url + '/test_payment');

        if (res.status === 200) {
            return { success: true, message: 'Ok', data: res.data };
        } else {
            return { success: false, message: `Something went wrong (${res.status})`, data: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', data: null };
    }
};

const validateSignatureFromUrl = async (returnUrl: string): Promise<Response> => {
    try {
        const res = await axios.post(url + '/validate', { url: returnUrl }, apiKeyConfig());

        return { success: res.status === 200, message: res.data.message };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

export default {
    createPayment,
    createTestPayment,
    validateSignatureFromUrl,
};

import axios from 'axios';

import { Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';

interface PaytrailResponse extends Response {
    data: object;
}

const url = apiBaseUrl + '/paytrail';

const createTestPayment = async (): Promise<PaytrailResponse> => {
    try {
        const res = await axios.get(url + '/test_payment');

        if (res.status === 200) {
            return { success: true, message: 'Ok', data: res.data };
        } else {
            return { success: false, message: `Something went wrong (${res.status})`, data: {} };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', data: {} };
    }
};

export default {
    createTestPayment,
};

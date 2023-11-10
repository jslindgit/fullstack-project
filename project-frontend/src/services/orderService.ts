import axios from 'axios';

import { Response } from '../types/types';
import { Order, OrderStatus } from '../types/orderTypes';

import { apiBaseUrl } from '../constants';
import { apiKeyConfig } from '../util/serviceProvider';
import { handleError } from '../util/handleError';
import { orderFromResponseBody } from '../types/orderTypeFunctions';

const url = apiBaseUrl + '/orders';

interface OrderResponse extends Response {
    order: Order | null;
}

const getAll = async (): Promise<Order[]> => {
    try {
        const { data } = await axios.get<Order[]>(url);
        return data.map((order) => orderFromResponseBody(order));
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const getById = async (id: number): Promise<OrderResponse> => {
    try {
        const res = await axios.get(`${url}/${id}`);
        if (res.status >= 200 && res.status <= 299) {
            return { success: true, message: 'Ok', order: orderFromResponseBody(res.data) };
        } else {
            return { success: false, message: `Something went wrong (${res.status})`, order: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', order: null };
    }
};

const update = async (orderId: number, toUpdate: object): Promise<OrderResponse> => {
    try {
        const res = await axios.put<Order>(`${url}/${orderId}`, toUpdate, apiKeyConfig());

        if (res.status === 200) {
            return { success: true, message: `Order ${orderId} updated`, order: orderFromResponseBody(res) };
        } else {
            return { success: false, message: 'Something went wrong, try again later', order: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', order: null };
    }
};

const updateStatus = async (orderId: number, newStatus: OrderStatus): Promise<OrderResponse> => {
    try {
        const res = await axios.put<Order>(`${url}/${orderId}`, { status: newStatus }, apiKeyConfig());

        if (res.status === 200) {
            return { success: true, message: `Order ${orderId} updated`, order: orderFromResponseBody(res) };
        } else {
            return { success: false, message: 'Something went wrong, try again later', order: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', order: null };
    }
};

export default {
    getAll,
    getById,
    update,
    updateStatus,
};

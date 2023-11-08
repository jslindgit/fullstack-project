import axios from 'axios';

import { Response } from '../types/types';
import { Order, OrderStatus } from '../types/orderTypes';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/serviceProvider';
import { handleError } from '../util/handleError';

const url = apiBaseUrl + '/orders';

interface OrderResponse extends Response {
    order: Order | null;
}

const getAll = async () => {
    try {
        const { data } = await axios.get<Order[]>(url);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const getById = async (id: number) => {
    try {
        const { data } = await axios.get<Order>(`${url}/${id}`);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const updateStatus = async (order: Order, newStatus: OrderStatus, token: string): Promise<OrderResponse> => {
    try {
        const res = await axios.put<Order>(`${url}/${order.id}`, { status: newStatus }, authConfig(token));
        const data = res.data;

        if (res.status === 200) {
            return { success: true, message: `Order ${order.id} updated`, order: data };
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
    updateStatus,
};

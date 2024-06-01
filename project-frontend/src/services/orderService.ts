import axios from 'axios';

/*import { Config } from '../types/configTypes';
import { ContentID } from '../content';*/
import { /*NewOrder, */ Order, OrderStatus } from '../types/orderTypes';
import { Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
/*import { contentToText } from '../types/languageFunctions';*/
import { orderFromResponseBody /*, orderToRequestBody*/ } from '../util/orderProvider';
/*import { isOrder } from '../types/orderTypeFunctions';*/
import { apiKeyConfig /*, authConfig*/ } from '../util/serviceProvider';

const url = apiBaseUrl + '/orders';

export interface OrderResponse extends Response {
    order: Order | null;
}

/*const addNew = async (newOrder: NewOrder, config: Config, userId: number | null): Promise<OrderResponse> => {
    try {
        const { data } = await axios.post(url, orderToRequestBody(newOrder, config, false, userId), apiKeyConfig());
        const order = orderFromResponseBody(data);
        if (isOrder(order)) {
            return { success: true, message: 'Ok', order: order };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), order: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config), order: null };
    }
};*/

/*const deleteOrder = async (order: Order, token: string, config: Config): Promise<Response> => {
    try {
        const res = await axios.delete<Order>(`${url}/${order.id}`, authConfig(token));
        if (res.status === 204) {
            return {
                success: true,
                message: `${contentToText(ContentID.miscOrder, config)} #${order.id} (${order.customerFirstName} ${order.customerLastName}) ${contentToText(
                    ContentID.miscDeleted,
                    config
                )}.`,
            };
        } else {
            return { success: false, message: 'Something went wrong, try again later' };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};*/

const getAll = async (): Promise<Order[]> => {
    try {
        const { data } = await axios.get<Order[]>(url, apiKeyConfig());
        return data.map((order) => orderFromResponseBody(order));
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const getById = async (id: number): Promise<OrderResponse> => {
    try {
        const res = await axios.get(`${url}/${id}`, apiKeyConfig());
        if (res.status >= 200 && res.status <= 299) {
            return { success: true, message: 'Ok', order: orderFromResponseBody(res.data) };
        } else {
            return { success: false, message: `Something went wrong (${res.status})`, order: null };
        }
    } catch (err: unknown) {
        return { success: false, message: 'Error occurred', order: null };
    }
};

const update = async (orderId: number, toUpdate: object): Promise<OrderResponse> => {
    try {
        const res = await axios.put<Order>(`${url}/${orderId}`, toUpdate, apiKeyConfig());

        if (res.status === 200) {
            return { success: true, message: `Order ${orderId} updated`, order: orderFromResponseBody(res.data) };
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
    /*addNew,*/
    /*deleteOrder,*/
    getAll,
    getById,
    update,
    updateStatus,
};

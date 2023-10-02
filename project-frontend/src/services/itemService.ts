import axios from 'axios';

import { Config, Item, Response } from '../types/types';

import item_categoryService from './item_categoryService';
import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { handleError } from '../util/error_handler';
import { toNewItem } from '../types/type_functions';

interface ItemResponse extends Response {
    addedItem: Item | null;
}

const url = apiBaseUrl + '/items';

const add = async (toAdd: object, category_id: number | null, token: string, config: Config): Promise<ItemResponse> => {
    try {
        const newItem = toNewItem(toAdd);
        const { data } = await axios.post(url, { ...newItem, category_id: category_id }, authConfig(token));

        if ('name' in data && 'price' in data) {
            return { success: true, message: `New item added: ${data.name} (${data.price} ${config.currency})`, addedItem: data };
        } else {
            handleError('Server did not return an Item object');
            return { success: false, message: 'Something went wrong, try again later', addedItem: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Something went wrong', addedItem: null };
    }
};

const deleteItem = async (item: Item, token: string): Promise<Response> => {
    try {
        // First delete the connection tables involving this Item:
        await item_categoryService.deleteAllConnectionsByItem(item, token);

        const res = await axios.delete<Item>(`${url}/${item.id}`, authConfig(token));
        if (res.status === 204) {
            return { success: true, message: `Item ${item.name} deleted` };
        } else {
            return { success: false, message: 'Something went wrong, try again later' };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Something went wrong' };
    }
};

const getAll = async () => {
    try {
        const { data } = await axios.get<Item[]>(url);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const getById = async (id: number) => {
    try {
        const { data } = await axios.get<Item>(`${url}/${id}`);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

export default {
    add,
    deleteItem,
    getAll,
    getById,
};

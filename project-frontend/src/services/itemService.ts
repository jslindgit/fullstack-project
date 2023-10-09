import axios from 'axios';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { Config, Item, Response } from '../types/types';

import { initializeCategories } from '../reducers/categoryReducer';

import item_categoryService from './item_categoryService';
import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { handleError } from '../util/error_handler';
import { toNewItem } from '../types/type_functions';

interface ItemResponse extends Response {
    item: Item | null;
}

const url = apiBaseUrl + '/items';

const add = async (toAdd: object, category_id: number | null, token: string, config: Config, dispatch: Dispatch<AnyAction>): Promise<ItemResponse> => {
    try {
        const newItem = toNewItem(toAdd);
        const body = category_id ? { ...newItem, category_id: category_id } : newItem;
        const { data } = await axios.post(url, body, authConfig(token));

        if ('name' in data && 'price' in data) {
            await initializeCategories(dispatch);
            return { success: true, message: `New item added: ${data.name} (${data.price} ${config.currency})`, item: data };
        } else {
            handleError('Server did not return an Item object');
            return { success: false, message: 'Something went wrong, try again later', item: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', item: null };
    }
};

const deleteItem = async (item: Item, token: string, dispatch: Dispatch<AnyAction>): Promise<Response> => {
    try {
        // First delete the connection tables involving this Item:
        await item_categoryService.deleteAllConnectionsByItem(item, token);

        const res = await axios.delete<Item>(`${url}/${item.id}`, authConfig(token));
        if (res.status === 204) {
            await initializeCategories(dispatch);
            return { success: true, message: `Item ${item.name} deleted` };
        } else {
            return { success: false, message: 'Something went wrong, try again later' };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

const getAll = async (): Promise<Item[]> => {
    try {
        const { data } = await axios.get<Item[]>(url);
        return data;
    } catch (err: unknown) {
        handleError(err);
        return [];
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

const update = async (item: Item, token: string, dispatch: Dispatch<AnyAction>): Promise<ItemResponse> => {
    try {
        const toUpdate = { name: item.name, description: item.description, price: item.price, instock: item.instock };

        const res = await axios.put<Item>(`${url}/${item.id}`, toUpdate, authConfig(token));
        const data = res.data;

        if ('name' in data && 'price' in data) {
            await initializeCategories(dispatch);
            return { success: true, message: `Item ${data.name} updated`, item: data };
        } else {
            handleError('Server did not return an Item object');
            return { success: false, message: 'Something went wrong, try again later', item: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', item: null };
    }
};

export default {
    add,
    deleteItem,
    getAll,
    getById,
    update,
};

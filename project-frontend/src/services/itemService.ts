import axios from 'axios';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { Config } from '../types/configTypes';
import { Item, NewItem, Response } from '../types/types';

import { initializeCategories } from '../reducers/categoryReducer';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import item_categoryService from './item_categoryService';
import { langTextsToText } from '../types/languageFunctions';
import { authConfig, itemFromResBody, itemToReqBody } from '../util/serviceProvider';

interface ItemResponse extends Response {
    item: Item | null;
}

const url = apiBaseUrl + '/items';

const add = async (toAdd: NewItem, category_id: number | null, token: string, config: Config, dispatch: Dispatch<AnyAction>): Promise<ItemResponse> => {
    try {
        const itemData = itemToReqBody(toAdd);
        const body = category_id ? { ...itemData, category_id: category_id } : itemData;
        const { data } = await axios.post(url, body, authConfig(token));

        const item = itemFromResBody(data);

        if (item) {
            await initializeCategories(dispatch);
            return { success: true, message: `New item added: ${langTextsToText(item.name, config)}`, item: item };
        } else {
            handleError('Server did not return an Item object');
            return { success: false, message: 'Something went wrong, try again later', item: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', item: null };
    }
};

const deleteItem = async (item: Item, token: string, config: Config, dispatch: Dispatch<AnyAction>): Promise<Response> => {
    try {
        // First delete the connection tables involving this Item:
        await item_categoryService.deleteAllConnectionsByItem(item, token);

        const res = await axios.delete<Item>(`${url}/${item.id}`, authConfig(token));
        if (res.status === 204) {
            await initializeCategories(dispatch);
            return { success: true, message: `Item ${langTextsToText(item.name, config)} deleted` };
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
        const items: Item[] = [];
        data.forEach((itemData) => {
            const item = itemFromResBody(itemData);
            if (item) {
                items.push(item);
            }
        });
        return items;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const getById = async (id: number): Promise<Item | null> => {
    try {
        const { data } = await axios.get<Item>(`${url}/${id}`);
        return itemFromResBody(data);
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (item: Item, token: string, config: Config, dispatch: Dispatch<AnyAction>): Promise<ItemResponse> => {
    try {
        const toUpdate = { name: item.name, description: item.description, price: item.price, instock: item.instock, images: item.images };

        const res = await axios.put<Item>(`${url}/${item.id}`, itemToReqBody(toUpdate), authConfig(token));
        const updatedItem = itemFromResBody(res.data);

        if (updatedItem) {
            await initializeCategories(dispatch);
            return { success: true, message: `Item ${langTextsToText(updatedItem.name, config)} updated`, item: updatedItem };
        } else {
            handleError(new Error('Server did not return an Item object'));
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

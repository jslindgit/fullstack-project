import axios from 'axios';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { Order } from '../types/orderTypes';
import { Item, NewItem, Response } from '../types/types';

import { initializeCategories } from '../reducers/categoryReducer';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import item_categoryService from './item_categoryService';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { apiKeyConfig, authConfig, itemFromResBody, itemToReqBody } from '../util/serviceProvider';

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
            return { success: true, message: `${contentToText(ContentID.adminItemsNewItemAdded, config)}: ${langTextsToText(item.name, config)}`, item: item };
        } else {
            handleError('Server did not return an Item object');
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), item: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorOccurred, config), item: null };
    }
};

const deleteItem = async (item: Item, token: string, config: Config, dispatch: Dispatch<AnyAction>): Promise<Response> => {
    try {
        // First delete the connection tables involving this Item:
        await item_categoryService.deleteAllConnectionsByItem(item, token);

        const res = await axios.delete<Item>(`${url}/${item.id}`, authConfig(token));
        if (res.status === 204) {
            await initializeCategories(dispatch);
            return {
                success: true,
                message: `${contentToText(ContentID.itemsItem, config)} "${langTextsToText(item.name, config)}" ${contentToText(
                    ContentID.miscDeleted,
                    config
                )}.`,
            };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config) };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorOccurred, config) };
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

const getBySearchQuery = async (searchQuery: string, config: Config): Promise<Item[]> => {
    try {
        const { data } = await axios.get<Item[]>(url);
        const items: Item[] = [];
        data.forEach((itemData) => {
            const item = itemFromResBody(itemData);
            if (item && langTextsToText(item.name, config).toLowerCase().includes(searchQuery.toLowerCase())) {
                items.push(item);
            }
        });
        return items;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const update = async (item: Item, config: Config, dispatch: Dispatch<AnyAction> | null): Promise<ItemResponse> => {
    try {
        const toUpdate = {
            description: item.description,
            images: item.images,
            instock: item.instock,
            name: item.name,
            price: item.price,
            sizes: item.sizes,
            sold: item.sold,
        };

        const res = await axios.put<Item>(`${url}/${item.id}`, itemToReqBody(toUpdate), apiKeyConfig());
        const updatedItem = itemFromResBody(res.data);

        if (updatedItem) {
            if (dispatch) {
                await initializeCategories(dispatch);
            }
            return {
                success: true,
                message: `${contentToText(ContentID.itemsItem, config)} "${langTextsToText(updatedItem.name, config)}" ${contentToText(
                    ContentID.miscUpdated,
                    config
                )}.`,
                item: updatedItem,
            };
        } else {
            handleError(new Error('Server did not return an Item object'));
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), item: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config), item: null };
    }
};

const updateInstockAndSoldValues = async (order: Order, config: Config) => {
    order.items.forEach(async (shoppingItem) => {
        const item = await getById(shoppingItem.id);
        if (item) {
            await update({ ...item, instock: item.instock - shoppingItem.quantity, sold: item.sold + shoppingItem.quantity }, config, null);
        }
    });
};

export default {
    add,
    deleteItem,
    getAll,
    getById,
    getBySearchQuery,
    update,
    updateInstockAndSoldValues,
};

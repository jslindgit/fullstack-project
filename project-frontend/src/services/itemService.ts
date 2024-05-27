import axios from 'axios';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { Order } from '../types/orderTypes';
import { /*NewItem, */ Item, ItemSizeAndInstock, Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { apiKeyConfig, authConfig, itemFromResBody /*, itemToReqBody*/ } from '../util/serviceProvider';

export interface ItemResponse extends Response {
    item: Item | null;
}

const url = apiBaseUrl + '/items';

/*const add = async (toAdd: NewItem, category_id: number | null, token: string, config: Config): Promise<ItemResponse> => {
    try {
        const itemData = itemToReqBody(toAdd);
        const body = category_id ? { ...itemData, category_id: category_id } : itemData;
        const { data } = await axios.post(url, body, authConfig(token));

        const item = itemFromResBody(data);

        if (item) {
            return { success: true, message: `${contentToText(ContentID.adminItemsNewItemAdded, config)}: ${langTextsToText(item.name, config)}`, item: item };
        } else {
            handleError('Server did not return an Item object');
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), item: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: contentToText(ContentID.errorOccurred, config), item: null };
    }
};*/

const deleteItem = async (item: Item, token: string, config: Config): Promise<Response> => {
    try {
        const res = await axios.delete<Item>(`${url}/${item.id}`, authConfig(token));
        if (res.status === 204) {
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

/*const getAll = async (): Promise<Item[]> => {
    try {
        const { data } = await axios.get<Item[]>(url, apiKeyConfig());
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
};*/

const getById = async (id: number): Promise<Item | null> => {
    try {
        const { data } = await axios.get<Item>(`${url}/${id}`, apiKeyConfig());
        return itemFromResBody(data);
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getBySearchQuery = async (searchQuery: string, config: Config): Promise<Item[]> => {
    try {
        const { data } = await axios.get<Item[]>(url, apiKeyConfig());
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

/*const update = async (item: Item, token: string, config: Config): Promise<ItemResponse> => {
    try {
        const res = await axios.put<Item>(`${url}/${item.id}`, itemToReqBody(item), authConfig(token));
        const updatedItem = itemFromResBody(res.data);

        if (updatedItem) {
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
};*/

const updateInstockAndSoldValues = async (order: Order) => {
    try {
        order.items.forEach(async (shoppingItem) => {
            const item = await getById(shoppingItem.id);
            if (item) {
                const currentSizes = [...item.sizes];
                const size = currentSizes.find((s) => s.size === (shoppingItem.size.length > 0 ? shoppingItem.size : '-'));
                const finalSizes: ItemSizeAndInstock[] = size
                    ? [...currentSizes.filter((s) => s.size !== size.size), { size: size.size, instock: size.instock - shoppingItem.quantity }]
                    : currentSizes;

                await axios.put(
                    `${url}/updateinstockandsold/${item.id}`,
                    {
                        sizes: finalSizes.map((sizeAndInstock) => JSON.stringify(sizeAndInstock)),
                        sold: item.sold + shoppingItem.quantity,
                    },
                    apiKeyConfig()
                );
            } else {
                handleError(`Item with id ${shoppingItem.id} not found.`);
            }
        });
    } catch (err: unknown) {
        handleError(err);
    }
};

export default {
    /*add,*/
    deleteItem,
    /*getAll,*/
    getById,
    getBySearchQuery,
    /*update,*/
    updateInstockAndSoldValues,
};

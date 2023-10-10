import axios from 'axios';

import { Category, Item, Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/serviceProvider';
import { handleError } from '../util/handleError';

const url = apiBaseUrl + '/item_categories';

const addConnection = async (item: Item, category: Category, token: string): Promise<Response> => {
    try {
        await axios.post(url, { item_id: item.id, category_id: category.id }, authConfig(token));

        return { success: true, message: `${item.name} added to category ${category.name}` };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

const deleteAllConnectionsByItem = async (item: Item, token: string): Promise<Response> => {
    try {
        await axios.delete(url + '/all_by_item_id/' + item.id, authConfig(token));

        return { success: true, message: `${item.name} removed from all categories` };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

const deleteConnection = async (itemId: number, categoryId: number, token: string): Promise<Response> => {
    try {
        const res = await axios.delete(url + '/item_and_category_id', { ...authConfig(token), data: { item_id: itemId, category_id: categoryId } });
        if (res.status === 204) {
            return { success: true, message: 'Connection deleted' };
        } else {
            return { success: false, message: 'Request failed with status code ' + res.status };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred' };
    }
};

export default {
    addConnection,
    deleteAllConnectionsByItem,
    deleteConnection,
};

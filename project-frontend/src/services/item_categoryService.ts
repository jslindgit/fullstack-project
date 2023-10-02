import axios from 'axios';

import { Category, Item, Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { handleError } from '../util/error_handler';

const url = apiBaseUrl + '/item_categories';

const addConnection = async (item: Item, category: Category, token: string): Promise<Response> => {
    try {
        await axios.post(url, { item_id: item.id, category_id: category.id }, authConfig(token));

        return { success: true, message: `${item.name} added to category ${category.name}` };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Something went wrong' };
    }
};

const deleteAllConnectionsByItem = async (item: Item, token: string): Promise<Response> => {
    try {
        await axios.delete(url + '/all_by_item_id/' + item.id, authConfig(token));

        return { success: true, message: `${item.name} removed from all categories` };
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Something went wrong' };
    }
};

export default {
    addConnection,
    deleteAllConnectionsByItem,
};

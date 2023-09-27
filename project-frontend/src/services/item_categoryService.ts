import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { Category, Item } from '../types/types';
import { handleError } from '../util/error_handler';

const url = apiBaseUrl + '/item_categories';

const addConnection = async (item: Item, category: Category, token: string): Promise<string> => {
    try {
        const { data } = await axios.post(url, { item_id: item.id, category_id: category.id }, authConfig(token));

        console.log('data:', data);

        return `${item.name} added to category ${category.name}`;
    } catch (err: unknown) {
        handleError(err);
        return 'Something went wrong';
    }
};

export default {
    addConnection,
};

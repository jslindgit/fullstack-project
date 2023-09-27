import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { Config } from '../types/types';
import { handleError } from '../util/error_handler';
import { Item as Interface } from '../types/types';
import { toNewItem } from '../types/type_functions';

const url = apiBaseUrl + '/items';

const add = async (toAdd: object, category_id: number | null, token: string, config: Config): Promise<string> => {
    try {
        const newItem = toNewItem(toAdd);
        const { data } = await axios.post(url, { ...newItem, category_id: category_id }, authConfig(token));

        if ('name' in data && 'price' in data) {
            return `${data.name} (${data.price} ${config.currency}) added`;
        } else {
            handleError('Server did not return an Item object');
            return 'Something went wrong';
        }
    } catch (err: unknown) {
        handleError(err);
        return 'Something went wrong';
    }
};

const deleteById = async (id: number, token: string) => {
    const { data } = await axios.delete<Interface>(`${url}/${id}`, authConfig(token));
    return data;
};

const getAll = async () => {
    const { data } = await axios.get<Interface[]>(url);
    return data;
};

const getById = async (id: number) => {
    const { data } = await axios.get<Interface>(`${url}/${id}`);
    return data;
};

export default {
    add,
    deleteById,
    getAll,
    getById,
};

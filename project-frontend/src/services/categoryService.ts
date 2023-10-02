import axios from 'axios';

import { Category, NewCategory, Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { handleError } from '../util/error_handler';

const url = apiBaseUrl + '/categories';

interface CategoryResponse extends Response {
    addedCategory: Category | null;
}

const add = async (toAdd: NewCategory, token: string): Promise<CategoryResponse> => {
    try {
        const { data } = await axios.post(url, toAdd, authConfig(token));

        if ('name' in data) {
            return { success: true, message: 'New category added: ' + data.name, addedCategory: data };
        } else {
            handleError('Server did not return a Category object');
            return { success: false, message: 'Something went wrong, try again later', addedCategory: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Something went wrong', addedCategory: null };
    }
};

const deleteById = async (id: number, token: string) => {
    const { data } = await axios.delete<Category>(`${url}/${id}`, authConfig(token));
    return data;
};

const getAll = async () => {
    const { data } = await axios.get<Category[]>(url);
    return data;
};

const getById = async (id: number) => {
    const { data } = await axios.get<Category>(`${url}/${id}`);
    return data;
};

export default {
    add,
    deleteById,
    getAll,
    getById,
};

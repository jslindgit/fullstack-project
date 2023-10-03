import axios from 'axios';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { Category, NewCategory, Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { handleError } from '../util/error_handler';

import { addCategory } from '../reducers/categoryReducer';

interface CategoryResponse extends Response {
    addedCategory: Category | null;
}

const url = apiBaseUrl + '/categories';

const add = async (toAdd: NewCategory, token: string, dispatch: Dispatch<AnyAction>): Promise<CategoryResponse> => {
    try {
        const { data } = await axios.post(url, toAdd, authConfig(token));

        if ('name' in data) {
            dispatch(addCategory(data));
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

const deleteCategory = async (cateory: Category, token: string): Promise<Response> => {
    try {
        const res = await axios.delete<Category>(`${url}/${cateory.id}`, authConfig(token));
        if (res.status === 204) {
            return { success: true, message: `Category ${cateory.name} deleted` };
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
        const { data } = await axios.get<Category[]>(url);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const getById = async (id: number) => {
    try {
        const { data } = await axios.get<Category>(`${url}/${id}`);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

export default {
    add,
    deleteCategory,
    getAll,
    getById,
};

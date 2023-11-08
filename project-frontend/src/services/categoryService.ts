import axios from 'axios';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

import { Category, NewCategory, Response } from '../types/types';

import { initializeCategories } from '../reducers/categoryReducer';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/serviceProvider';
import { handleError } from '../util/handleError';

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

const update = async (category: Category, token: string, dispatch: Dispatch<AnyAction>): Promise<CategoryResponse> => {
    try {
        const toUpdate = { name: category.name, description: category.description };

        const res = await axios.put<Category>(`${url}/${category.id}`, toUpdate, authConfig(token));
        const data = res.data;

        if ('name' in data && 'description' in data) {
            await initializeCategories(dispatch);
            return { success: true, message: `Category "${data.name}" updated`, addedCategory: data };
        } else {
            handleError(new Error('Server did not return a Category object'));
            return { success: false, message: 'Something went wrong, try again later', addedCategory: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', addedCategory: null };
    }
};

export default {
    add,
    deleteCategory,
    getAll,
    getById,
    update,
};

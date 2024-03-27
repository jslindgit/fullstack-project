import axios from 'axios';

import { Config } from '../types/configTypes';
import { Category, NewCategory, Response } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import { langTextsToText } from '../types/languageFunctions';
import { authConfig } from '../util/serviceProvider';
import { categoryFromResBody, categoryToReqBody } from '../util/serviceProvider';

interface CategoryResponse extends Response {
    addedCategory: Category | null;
}

const url = apiBaseUrl + '/categories';

const add = async (toAdd: NewCategory, token: string): Promise<CategoryResponse> => {
    try {
        const { data } = await axios.post(url, categoryToReqBody(toAdd), authConfig(token));

        const addedCategory = categoryFromResBody(data);

        if (addedCategory) {
            return { success: true, message: 'New category added.', addedCategory: addedCategory };
        } else {
            handleError('Server did not return a Category object');
            return { success: false, message: 'Something went wrong, try again later.', addedCategory: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Something went wrong.', addedCategory: null };
    }
};

const deleteCategory = async (category: Category, token: string, config: Config): Promise<Response> => {
    try {
        const res = await axios.delete<Category>(`${url}/${category.id}`, authConfig(token));
        if (res.status === 204) {
            return { success: true, message: `Category ${langTextsToText(category.name, config)} deleted.` };
        } else {
            return { success: false, message: 'Something went wrong, try again later.' };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred.' };
    }
};

const getAll = async (): Promise<Category[]> => {
    try {
        const { data } = await axios.get<Category[]>(url);
        const result: Category[] = [];
        data.forEach((c) => {
            if (c) {
                const category = categoryFromResBody(c);
                if (category) {
                    result.push(category);
                }
            }
        });
        return result;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

const getById = async (id: number): Promise<Category | null> => {
    try {
        const { data } = await axios.get<Category>(`${url}/${id}`);
        return categoryFromResBody(data);
    } catch (err: unknown) {
        return null;
    }
};

const update = async (category: Category, token: string): Promise<CategoryResponse> => {
    try {
        const toUpdate = { name: category.name, description: category.description };

        const res = await axios.put<Category>(`${url}/${category.id}`, categoryToReqBody(toUpdate), authConfig(token));

        const updatedCategory = categoryFromResBody(res.data);

        if (updatedCategory) {
            return { success: true, message: 'Category updated.', addedCategory: updatedCategory };
        } else {
            handleError(new Error('Server did not return a Category object.'));
            return { success: false, message: 'Something went wrong, try again later.', addedCategory: null };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred.', addedCategory: null };
    }
};

export default {
    add,
    deleteCategory,
    getAll,
    getById,
    update,
};

import { Credentials, NewItem_Category } from './types';
import { NewCategory } from '../models/category';
import { NewItem } from '../models/item';

import { isNewCategory } from '../models/category';
import { isNewItem } from '../models/item';
import { NewSettings, isNewSettings } from '../models/settings';

export const isBoolean = (text: unknown): text is boolean => {
    return typeof text === 'boolean' || text instanceof Boolean;
};

export const isNumber = (text: unknown): text is number => {
    return typeof text === 'number' || text instanceof Number;
};

export const isObject = (variable: unknown): variable is object => {
    return typeof variable === 'object' || variable instanceof Object;
};

export const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseNumber = (value: unknown, fieldName: string): number => {
    if (!value || !isNumber(value)) {
        throw new Error(`Incorrect or missing value for ${fieldName}: "${value}"`);
    }
    return value;
};

const parseString = (value: unknown, fieldName: string): string => {
    if (!value || !isString(value)) {
        throw new Error(`Incorrect or missing value for ${fieldName}: "${value}"`);
    }
    return value;
};

export const toCredentials = (object: unknown): Credentials => {
    if (!isObject(object)) {
        throw new Error('Incorrect or missing data for toCredentials');
    }

    if ('username' in object && 'password' in object) {
        const credentials: Credentials = {
            username: parseString(object.username, 'username'),
            password: parseString(object.password, 'password'),
        };

        return credentials;
    }

    throw new Error('Incorrect data: some fields ("username" or "password") are missing for toNewItem');
};

export const toNewCategory = (object: unknown): NewCategory => {
    if (!isNewCategory(object)) {
        throw new Error('Incorrect or missing data for toNewCategory');
    } else {
        return object;
    }
};

export const toNewItem = (object: unknown): NewItem => {
    if (!isNewItem(object)) {
        throw new Error('Incorrect or missing data for toNewItem');
    } else {
        return object;
    }
};

export const toNewItem_Category = (object: unknown): NewItem_Category => {
    if (!isObject(object)) {
        throw new Error('Incorrect or missing data for toNewItem_Category');
    }

    if ('item_id' in object && 'category_id' in object) {
        const newItem_Category: NewItem_Category = {
            itemId: parseNumber(object.item_id, 'item_id'),
            categoryId: parseNumber(object.category_id, 'category_id'),
        };

        return newItem_Category;
    }

    throw new Error('Incorrect data: some fields ("item_id" or "category_id") are missing for toNewItem_Category');
};

export const toNewSettings = (object: unknown): NewSettings => {
    if (!isNewSettings(object)) {
        throw new Error('Incorrect or missing data for toNewSettings');
    } else {
        return object;
    }
};

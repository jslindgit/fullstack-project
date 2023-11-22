import { NewCategory, NewItem, Response, User } from './types';

import { isLangText } from './languageFunctions';
import { handleError } from '../util/handleError';

export const isBoolean = (text: unknown): text is boolean => {
    return typeof text === 'boolean' || text instanceof Boolean;
};

export const isNumber = (text: unknown): text is number => {
    return typeof text === 'number' || text instanceof Number;
};

export const isObject = (variable: unknown): variable is object => {
    return typeof variable === 'object' || variable instanceof Object;
};

export const isResponse = (v: unknown): v is Response => {
    return isObject(v) && 'success' in v && isBoolean(v.success) && 'message' in v && isString(v.message);
};

export const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

export const isUint8Array = (data: unknown): data is Uint8Array => {
    return data instanceof Uint8Array;
};

export const isUser = (user: unknown): user is User => {
    return isObject(user) && 'id' in user && 'username' in user && 'name' in user && 'admin' in user && 'disabled' in user && 'token' in user;
};

export const toNewCategory = (obj: unknown): NewCategory => {
    if (
        isObject(obj) &&
        'name' in obj &&
        Array.isArray(obj.name) &&
        obj.name.every(isLangText) &&
        'description' in obj &&
        Array.isArray(obj.description) &&
        obj.description.every(isLangText)
    ) {
        return { name: obj.name, description: obj.description };
    }

    throw new Error('Incorrect data: some fields ("name" or "description") are missing or invalid for toNewCategory');
};

export const toNewItem = (obj: unknown): NewItem | null => {
    if (
        isObject(obj) &&
        'description' in obj &&
        Array.isArray(obj.description) &&
        obj.description.every(isLangText) &&
        'instock' in obj &&
        isNumber(obj.instock) &&
        'name' in obj &&
        Array.isArray(obj.name) &&
        obj.name.every(isLangText) &&
        'price' in obj &&
        isNumber(obj.price)
    ) {
        const newItem: NewItem = {
            description: obj.description,
            images: 'images' in obj && Array.isArray(obj.images) ? obj.images : [],
            instock: obj.instock,
            name: obj.name,
            price: obj.price,
        };

        return newItem;
    } else {
        handleError(new Error('Incorrect data: some fields ("name" or "price") are missing for toNewItem'));
        return null;
    }
};

import { NewCategory, NewItem, NewItem_Category, NewUser } from './types';

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

export const toNewCategory = (object: unknown): NewCategory => {
    if (!isObject(object)) {
        throw new Error('Incorrect or missing data for toNewCategory');
    }

    if ('name' in object) {
        const newCategory: NewCategory = {
            name: parseString(object.name, 'name'),
            description: 'description' in object ? parseString(object.description, 'description') : '',
        };

        return newCategory;
    }

    throw new Error('Incorrect data: "name" field is missing for toNewCategory');
};

export const toNewItem = (object: unknown): NewItem => {
    if (!isObject(object)) {
        throw new Error('Incorrect or missing data for toNewItem');
    }

    if ('name' in object && 'price' in object) {
        const newItem: NewItem = {
            name: parseString(object.name, 'name'),
            description: 'description' in object ? parseString(object.description, 'description') : '',
            price: parseNumber(object.price, 'price'),
            instock: 'instock' in object ? parseNumber(object.instock, 'instock') : 0,
        };

        return newItem;
    }

    throw new Error('Incorrect data: some fields ("name" or "price") are missing for toNewItem');
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

export const toNewUser = (object: unknown): NewUser => {
    if (!isObject(object)) {
        throw new Error('Incorrect or missing data for toNewUser');
    }

    if ('username' in object && 'name' in object) {
        const newUser: NewUser = {
            username: parseString(object.username, 'username'),
            name: parseString(object.name, 'name'),
            admin: 'admin' in object ? parseBoolean(object.admin, 'admin') : false,
            disabled: 'disabled' in object ? parseBoolean(object.disabled, 'disabled') : false,
            token: '',
        };

        return newUser;
    }

    throw new Error('Incorrect data: some fields ("username" or "name") are missing for toNewUser');
};

const parseBoolean = (value: unknown, fieldName: string): boolean => {
    if (!value || !isBoolean(value)) {
        throw new Error(`Incorrect or missing value for ${fieldName}: "${value}"`);
    }
    return value;
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

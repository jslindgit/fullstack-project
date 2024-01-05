import { Category, NewCategory } from '../types/types';
import { Item, NewItem } from '../types/types';

import { API_KEY } from '../constants';
import { handleError } from './handleError';
import { isNumber, isObject, isString } from '../types/typeFunctions';

interface AuthInterface {
    headers: object;
}

export const apiKeyConfig = (): AuthInterface => {
    return {
        headers: {
            Authorization: 'api_key ' + API_KEY,
        },
    };
};

export const authConfig = (token: string): AuthInterface => {
    return {
        headers: {
            Authorization: 'bearer ' + token,
        },
    };
};

export const categoryFromResBody = (resBody: unknown): Category | null => {
    if (
        isObject(resBody) &&
        'description' in resBody &&
        isString(resBody.description) &&
        'id' in resBody &&
        isNumber(resBody.id) &&
        'items' in resBody &&
        Array.isArray(resBody.items) &&
        'name' in resBody &&
        isString(resBody.name)
    ) {
        const items: Item[] = [];
        resBody.items.forEach((itemData) => {
            const item = itemFromResBody(itemData);
            if (item) {
                items.push(item);
            }
        });

        return { ...(resBody as Category), description: JSON.parse(resBody.description), items: items, name: JSON.parse(resBody.name) };
    } else {
        handleError(new Error('Invalid resBody for Category'));
        return null;
    }
};

export const categoryToReqBody = (category: NewCategory | Category): object => {
    return {
        ...category,
        name: JSON.stringify(category.name),
        description: JSON.stringify(category.description),
    };
};

export const itemFromResBody = (resBody: unknown, debug: boolean = false): Item | null => {
    if (debug) {
        console.log('resBody:', resBody);
    }
    if (
        isObject(resBody) &&
        'description' in resBody &&
        isString(resBody.description) &&
        'id' in resBody &&
        isNumber(resBody.id) &&
        'instock' in resBody &&
        isNumber(resBody.instock) &&
        'name' in resBody &&
        isString(resBody.name) &&
        'price' in resBody &&
        (isNumber(resBody.price) || isString(resBody.price)) &&
        'sizes' in resBody &&
        Array.isArray(resBody.sizes) &&
        'sold' in resBody &&
        isNumber(resBody.sold)
    ) {
        return {
            ...(resBody as Item),
            description: JSON.parse(resBody.description),
            name: JSON.parse(resBody.name),
            sizes: resBody.sizes.map((stringified) => JSON.parse(stringified)),
        };
    } else {
        handleError(new Error('Invalid resBody for Item'));
        return null;
    }
};

export const itemToReqBody = (item: NewItem | Item): object => {
    return {
        ...item,
        description: JSON.stringify(item.description),
        name: JSON.stringify(item.name),
        sizes: item.sizes.map((sizeAndInstock) => JSON.stringify(sizeAndInstock)),
    };
};

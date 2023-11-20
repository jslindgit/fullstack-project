import { NewCategory, Category } from '../types/types';

import { API_KEY } from '../constants';
import { isObject, isString } from '../types/typeFunctions';

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

export const categoryToReqBody = (category: NewCategory | Category): object => {
    return {
        ...category,
        name: JSON.stringify(category.name),
        description: JSON.stringify(category.description),
    };
};

export const categoryFromResBody = (resBody: unknown): Category => {
    if (!isObject(resBody)) {
        throw new Error('resBody is not an object');
    }

    if ('id' in resBody && 'name' in resBody && isString(resBody.name) && 'description' in resBody && isString(resBody.description)) {
        return { ...(resBody as Category), name: JSON.parse(resBody.name), description: JSON.parse(resBody.description) };
    } else {
        throw new Error('Invalid resBody');
    }
};

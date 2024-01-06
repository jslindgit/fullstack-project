import { NewCategory, Response, User } from './types';

import { isLangText } from './languageFunctions';

export const isBoolean = (text: unknown): text is boolean => {
    return typeof text === 'boolean' || text instanceof Boolean;
};

export const isNumber = (text: unknown): text is number => {
    return (typeof text === 'number' || text instanceof Number) && !isNaN(Number(text));
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

export const isUser = (obj: unknown): obj is User => {
    return (
        isObject(obj) &&
        'id' in obj &&
        isNumber(obj.id) &&
        'admin' in obj &&
        isBoolean(obj.admin) &&
        'contactAddress' in obj &&
        isString(obj.contactAddress) &&
        'contactCity' in obj &&
        isString(obj.contactCity) &&
        'contactCountry' in obj &&
        isString(obj.contactCountry) &&
        'contactFirstName' in obj &&
        isString(obj.contactFirstName) &&
        'contactLastName' in obj &&
        isString(obj.contactLastName) &&
        'contactPhone' in obj &&
        isString(obj.contactPhone) &&
        'contactZipcode' in obj &&
        isString(obj.contactZipcode) &&
        'disabled' in obj &&
        isBoolean(obj.disabled) &&
        'operator' in obj &&
        isBoolean(obj.operator) &&
        'username' in obj &&
        isString(obj.username)
    );
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

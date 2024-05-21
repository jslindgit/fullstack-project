import { User } from './types';

export const isBoolean = (text: unknown): text is boolean => {
    return typeof text === 'boolean' || text instanceof Boolean;
};

export const isNotNull = <T>(value: T | null | undefined): value is T => {
    return value !== null && value !== undefined;
};

export const isNumber = (text: unknown): text is number => {
    return (typeof text === 'number' || text instanceof Number) && !isNaN(Number(text));
};

export const isObject = (variable: unknown): variable is object => {
    return variable !== null && (typeof variable === 'object' || variable instanceof Object);
};

export const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
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

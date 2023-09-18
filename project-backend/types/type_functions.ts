import { NewItem } from './types';

export const isNumber = (text: unknown): text is number => {
    return typeof text === 'number' || text instanceof Number;
};

export const isObject = (variable: unknown): variable is object => {
    return typeof variable === 'object' || variable instanceof Object;
};

export const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

export const toNewItem = (object: unknown): NewItem => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'price' in object) {
        const newItem: NewItem = {
            name: parseString(object.name, 'name'),
            description:
                'description' in object
                    ? parseString(object.description, 'description')
                    : '',
            price: parseNumber(object.price, 'price'),
            stockbalance:
                'stockbalance' in object
                    ? parseNumber(object.stockbalance, 'stockbalance')
                    : 0,
        };

        return newItem;
    }

    throw new Error('Incorrect data: some fields (name or price)are missing');
};

const parseNumber = (value: unknown, fieldName: string): number => {
    if (!value || !isNumber(value)) {
        throw new Error(
            `Incorrect or missing value for ${fieldName}: "${value}"`
        );
    }
    return value;
};

const parseString = (value: unknown, fieldName: string): string => {
    if (!value || !isString(value)) {
        throw new Error(
            `Incorrect or missing value for ${fieldName}: "${value}"`
        );
    }
    return value;
};

import { NewItem } from '../types';

const isNumber = (text: unknown): text is number => {
    return typeof text === 'number' || text instanceof Number;
};

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

export const toNewItem = (object: unknown): NewItem => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if (
        'name' in object &&
        'description' in object &&
        'price' in object &&
        'stockbalance' in object
    ) {
        const newItem: NewItem = {
            name: parseString(object.name, 'name'),
            description: parseString(object.description, 'description'),
            price: parseNumber(object.price, 'price'),
            stockbalance: parseNumber(object.stockbalance, 'stockbalance'),
        };

        return newItem;
    }

    throw new Error('Incorrect data: some fields are missing');
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

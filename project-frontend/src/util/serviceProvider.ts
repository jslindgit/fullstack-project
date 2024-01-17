import { Category, NewCategory } from '../types/types';
import { Item, NewItem, Settings } from '../types/types';

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
        'name' in resBody &&
        isString(resBody.name)
    ) {
        const items: Item[] = [];
        if ('items' in resBody && Array.isArray(resBody.items)) {
            resBody.items.forEach((itemData) => {
                const item = itemFromResBody(itemData);
                if (item) {
                    items.push(item);
                }
            });
        }

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

export const settingsToReqBody = (settings: Settings): object => {
    return {
        ...settings,
        storeContactCountry: JSON.stringify(settings.storeContactCountry),
        storeDeliveryCountries: settings.storeDeliveryCountries.map((c) => JSON.stringify(c)),
        storeWelcome: JSON.stringify(settings.storeWelcome),
    };
};

export const settingsFromResBody = (resBody: unknown): Settings | null => {
    if (
        isObject(resBody) &&
        'id' in resBody &&
        isNumber(resBody.id) &&
        'ownerBusinessIdentifier' in resBody &&
        isString(resBody.ownerBusinessIdentifier) &&
        'ownerEmail' in resBody &&
        isString(resBody.ownerEmail) &&
        'ownerPhone' in resBody &&
        isString(resBody.ownerPhone) &&
        'storeContactCity' in resBody &&
        isString(resBody.storeContactCity) &&
        'storeContactCountry' in resBody &&
        isString(resBody.storeContactCountry) &&
        'storeContactEmail' in resBody &&
        isString(resBody.storeContactEmail) &&
        'storeContactPhone' in resBody &&
        isString(resBody.storeContactPhone) &&
        'storeContactStreetAddress' in resBody &&
        isString(resBody.storeContactStreetAddress) &&
        'storeContactZipcode' in resBody &&
        isString(resBody.storeContactZipcode) &&
        'storeDeliveryCountries' in resBody &&
        Array.isArray(resBody.storeDeliveryCountries) &&
        resBody.storeDeliveryCountries.every((c) => isString(c)) &&
        'storeDeliveryTimeBusinessDays' in resBody &&
        isNumber(resBody.storeDeliveryTimeBusinessDays) &&
        'storeName' in resBody &&
        isString(resBody.storeName) &&
        'storeWelcome' in resBody &&
        isString(resBody.storeWelcome) &&
        'vat' in resBody &&
        (isNumber(resBody.vat) || isString(resBody.vat))
    ) {
        return {
            ...(resBody as Settings),
            storeContactCountry: JSON.parse(resBody.storeContactCountry),
            storeDeliveryCountries: resBody.storeDeliveryCountries.map((c) => JSON.parse(c)),
            storeWelcome: JSON.parse(resBody.storeWelcome),
        };
    } else {
        console.log('resBody:', resBody);
        handleError('Invalid resBody for Settings');
        return null;
    }
};

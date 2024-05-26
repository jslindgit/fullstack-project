import { Settings } from '../types/configTypes';
import { Category, Item, NewCategory, NewItem } from '../types/types';

import { API_KEY } from '../constants';
import { handleError } from './handleError';
import { isNumber, isObject, isString } from '../types/typeFunctions';

interface AuthInterface {
    headers: object;
}

export const apiKeyConfig = () => {
    return {
        headers: {
            apikey: 'api_key ' + API_KEY,
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

export const categoryFromResBody = (resData: unknown): Category | null => {
    if (
        isObject(resData) &&
        'description' in resData &&
        isString(resData.description) &&
        'id' in resData &&
        isNumber(resData.id) &&
        'name' in resData &&
        isString(resData.name)
    ) {
        const items: Item[] = [];
        if ('items' in resData && Array.isArray(resData.items)) {
            resData.items.forEach((itemData) => {
                const item = itemFromResBody(itemData);
                if (item) {
                    items.push(item);
                }
            });
        }

        return { ...(resData as Category), description: JSON.parse(resData.description), items: items, name: JSON.parse(resData.name) };
    } else {
        handleError(new Error('Invalid resData for Category'));
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

export const itemFromResBody = (resBody: unknown): Item | null => {
    if (
        isObject(resBody) &&
        'description' in resBody &&
        isString(resBody.description) &&
        'fitsInLetter' in resBody &&
        isNumber(resBody.fitsInLetter) &&
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
        handleError('Invalid resBody for Settings');
        return null;
    }
};

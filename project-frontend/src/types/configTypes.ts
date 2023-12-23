import { Country, Currency } from './types';
import { Language } from './languageTypes';

import { isNumber, isObject, isString } from './typeFunctions';

export interface Config {
    currency: Currency;
    language: Language;
    maxItemPriceEUR: number;
    maxItemQuantity: number;
    owner: ConfigOwner;
    paytrail: ConfigPaytrail | null;
    store: ConfigStore;
    vat: number;
}

export const isConfig = (obj: unknown): obj is Config => {
    return (
        isObject(obj) &&
        'currency' in obj &&
        'language' in obj &&
        'maxItemPriceEUR' in obj &&
        isNumber(obj.maxItemPriceEUR) &&
        'maxItemQuantity' in obj &&
        isNumber(obj.maxItemQuantity) &&
        'owner' in obj &&
        isConfigOwner(obj.owner) &&
        'paytrail' in obj &&
        isConfigPaytrail(obj.paytrail) &&
        'store' in obj &&
        isConfigStore(obj.store) &&
        'vat' in obj &&
        isNumber(obj.vat)
    );
};

export interface ConfigOwner {
    businessIdentifier: string;
    email: string;
    name: string;
    phone: string;
}

const isConfigOwner = (obj: unknown): obj is ConfigOwner => {
    return (
        isObject(obj) &&
        'businessIdentifier' in obj &&
        isString(obj.businessIdentifier) &&
        'email' in obj &&
        isString(obj.email) &&
        'name' in obj &&
        isString(obj.name) &&
        'phone' in obj &&
        isString(obj.phone)
    );
};

export interface ConfigPaytrail {
    merchantId: string;
    secretKey: string;
}

const isConfigPaytrail = (obj: unknown): obj is ConfigPaytrail => {
    return isObject(obj) && 'merchantId' in obj && isString(obj.merchantId) && 'secretKey' in obj && isString(obj.secretKey);
};

export interface ConfigStore {
    contactCountry: Country;
    contactEmail: string;
    contactName: string;
    contactPhone: string;
    deliveryCountries: Country[];
    deliveryTimeBusinessDays: number;
}

const isConfigStore = (obj: unknown): obj is ConfigStore => {
    return (
        isObject(obj) &&
        'contactCountry' in obj &&
        'contactEmail' in obj &&
        isString(obj.contactEmail) &&
        'contactName' in obj &&
        isString(obj.contactName) &&
        'contactPhone' in obj &&
        isString(obj.contactPhone) &&
        'deliveryCountries' in obj &&
        Array.isArray(obj.deliveryCountries) &&
        'deliveryTimeBusinessDays' in obj &&
        isNumber(obj.deliveryTimeBusinessDays)
    );
};

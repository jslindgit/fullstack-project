import { Country, Currency } from './types';
import { LangText, Language } from './languageTypes';

import { isLangText } from './languageFunctions';
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
    contactCity: string;
    contactCountry: Country;
    contactEmail: string;
    contactName: string;
    contactPhone: string;
    contactStreetAddress: string;
    contactZipcode: string;
    deliveryCountries: Country[];
    deliveryTimeBusinessDays: number;
    welcome: LangText[];
}

const isConfigStore = (obj: unknown): obj is ConfigStore => {
    return (
        isObject(obj) &&
        'contactCity' in obj &&
        isString(obj.contactCity) &&
        'contactCountry' in obj &&
        'contactEmail' in obj &&
        isString(obj.contactEmail) &&
        'contactName' in obj &&
        isString(obj.contactName) &&
        'contactPhone' in obj &&
        isString(obj.contactPhone) &&
        'contactStreetAddress' in obj &&
        isString(obj.contactStreetAddress) &&
        'contactZipcode' in obj &&
        isString(obj.contactZipcode) &&
        'deliveryCountries' in obj &&
        Array.isArray(obj.deliveryCountries) &&
        'deliveryTimeBusinessDays' in obj &&
        isNumber(obj.deliveryTimeBusinessDays) &&
        'description' in obj &&
        Array.isArray(obj.description) &&
        obj.description.every((d) => isLangText(d)) &&
        'welcome' in obj &&
        Array.isArray(obj.welcome) &&
        obj.welcome.every((w) => isLangText(w))
    );
};

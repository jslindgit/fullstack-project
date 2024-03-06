import { Country, Currency } from './types';
import { LangText, Language } from './languageTypes';

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

export interface ConfigOwner {
    businessIdentifier: string;
    email: string;
    name: string;
    phone: string;
}

export interface ConfigPaytrail {
    merchantId: string;
    secretKey: string;
}

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

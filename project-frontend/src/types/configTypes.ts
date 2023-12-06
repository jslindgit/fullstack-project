import { Country, Currency } from './types';
import { Language } from './languageTypes';

export interface Config {
    currency: Currency;
    language: Language;
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
    contactCountry: Country;
    contactEmail: string;
    contactName: string;
    contactPhone: string;
    deliveryCountries: Country[];
    deliveryTimeBusinessDays: number;
}

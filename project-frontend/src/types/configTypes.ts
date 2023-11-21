import { Country, Currency } from './types';
import { LangContent, Language } from './languageTypes';

export interface Config {
    currency: Currency;
    langContent: LangContent[];
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
}

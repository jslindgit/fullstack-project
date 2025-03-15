import { LangCode, Language } from './types/languageTypes';
import { Config } from './types/configTypes';
import { Settings } from './types/settingsTypes';
import { Country, Currency } from './types/types';

export const API_KEY = import.meta.env.VITE_API_KEY as string;
export const apiBaseUrl = (import.meta.env.VITE_ENV as string) === 'dev' ? 'http://localhost:3001/api' : '/api';
export const testItemId = 5;
export const testUserId = 2;

export const availableDeliveryCountries: Country[] = [
    {
        names: [
            { langCode: LangCode.EN, text: 'Denmark' },
            { langCode: LangCode.FI, text: 'Tanska' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Estonia' },
            { langCode: LangCode.FI, text: 'Viro' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Finland' },
            { langCode: LangCode.FI, text: 'Suomi' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Latvia' },
            { langCode: LangCode.FI, text: 'Latvia' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Lithuania' },
            { langCode: LangCode.FI, text: 'Liettua' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Norway' },
            { langCode: LangCode.FI, text: 'Norja' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Sweden' },
            { langCode: LangCode.FI, text: 'Ruotsi' },
        ],
    },
];

export const availableLanguages: Language[] = [
    {
        code: LangCode.FI,
        decimalPoint: ',',
        name: 'Suomi',
        paytrailValue: 'FI',
    },
    {
        code: LangCode.EN,
        decimalPoint: '.',
        name: 'English',
        paytrailValue: 'EN',
    },
];

export const availableSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const defaultLanguage: Language = {
    code: LangCode.FI,
    decimalPoint: ',',
    name: 'Suomi',
    paytrailValue: 'FI',
};

export const defaultConfig: Config = {
    currency: Currency.EUR,
    language: defaultLanguage,
};

export const defaultSettings: Settings = {
    ownerBusinessIdentifier: '-',
    ownerEmail: '-',
    ownerName: '-',
    ownerPhone: '-',
    storeContactCity: '-',
    storeContactCountry: {
        names: [
            { langCode: LangCode.EN, text: '' },
            { langCode: LangCode.FI, text: '' },
        ],
    },
    storeContactEmail: '-',
    storeContactPhone: '-',
    storeContactStreetAddress: '-',
    storeContactZipcode: '-',
    storeDeliveryCountries: availableDeliveryCountries,
    storeDeliveryTimeBusinessDays: 1,
    storeName: '-',
    storeWelcome: [
        { langCode: LangCode.EN, text: 'Welcome!' },
        { langCode: LangCode.FI, text: 'Tervetuloa!' },
    ],
    vat: 25.5,
};

export const maxItemPriceEUR = 1000000;
export const maxItemQuantity = 1000;

// Paytrail test credentials: https://docs.paytrail.com/#/?id=test-credentials
export const paytrailMerchantId = '375917';
export const paytrailSecretKey = 'SAIPPUAKAUPPIAS';

import { LangCode, Language } from './types/languageTypes';
import { Config } from './types/configTypes';
import { Currency } from './types/types';

export const API_KEY = import.meta.env.VITE_API_KEY as string;
export const apiBaseUrl = 'http://localhost:3001/api';
export const pageWidth = 1024;
export const passwordMinLength = 10;

export const defaultLanguage: Language = {
    code: LangCode.FI,
    decimalPoint: ',',
    name: 'Suomi',
    paytrailValue: 'FI',
};

export const defaultConfig: Config = {
    currency: Currency.EUR,
    language: defaultLanguage,
    owner: {
        businessIdentifier: '1234567-8',
        email: 'owner@unnamedwebstore123.com',
        name: 'Unnamed Owner Oy',
        phone: '+358 40 123 45678',
    },
    paytrail: {
        merchantId: '375917',
        secretKey: 'SAIPPUAKAUPPIAS',
    },
    store: {
        contactCountry: {
            names: [
                { langCode: LangCode.EN, text: 'Finland' },
                { langCode: LangCode.FI, text: 'Suomi' },
            ],
        },
        contactEmail: 'info@unnamedwebstore123.com',
        contactName: 'Unnamed Webstore',
        contactPhone: '+358 9 123 45678',
        deliveryCountries: [
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
        ],
        deliveryTimeBusinessDays: 3,
    },
    vat: 24,
};

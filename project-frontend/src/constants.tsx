import { LangCode } from './types/language';
import { Currency, Config } from './types/types';

export const API_KEY = import.meta.env.VITE_API_KEY as string;
export const apiBaseUrl = 'http://localhost:3001/api';
export const pageWidth = 1024;

export const defaultConfig: Config = {
    currency: Currency.EUR,
    currencyBeforeSum: false,
    language: {
        code: LangCode.FI,
        name: 'Suomi',
        paytrailValue: 'FI',
    },
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
                { lang: LangCode.EN, text: 'Finland' },
                { lang: LangCode.FI, text: 'Suomi' },
            ],
        },
        contactEmail: 'info@unnamedwebstore123.com',
        contactName: 'Unnamed Webstore',
        contactPhone: '+358 9 123 45678',
        deliveryCountries: [
            {
                names: [
                    { lang: LangCode.EN, text: 'Denmark' },
                    { lang: LangCode.FI, text: 'Tanska' },
                ],
            },
            {
                names: [
                    { lang: LangCode.EN, text: 'Estonia' },
                    { lang: LangCode.FI, text: 'Viro' },
                ],
            },
            {
                names: [
                    { lang: LangCode.EN, text: 'Finland' },
                    { lang: LangCode.FI, text: 'Suomi' },
                ],
            },
            {
                names: [
                    { lang: LangCode.EN, text: 'Latvia' },
                    { lang: LangCode.FI, text: 'Latvia' },
                ],
            },
            {
                names: [
                    { lang: LangCode.EN, text: 'Lithuania' },
                    { lang: LangCode.FI, text: 'Liettua' },
                ],
            },
            {
                names: [
                    { lang: LangCode.EN, text: 'Norway' },
                    { lang: LangCode.FI, text: 'Norja' },
                ],
            },
            {
                names: [
                    { lang: LangCode.EN, text: 'Sweden' },
                    { lang: LangCode.FI, text: 'Ruotsi' },
                ],
            },
        ],
    },
    vat: 24,
};

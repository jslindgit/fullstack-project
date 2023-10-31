import { Currency, Config } from './types/types';

export const apiBaseUrl = 'http://localhost:3001/api';
export const pageWidth = 1024;

export const defaultConfig: Config = {
    currency: Currency.EUR,
    currencyBeforeSum: false,
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
        email: 'info@unnamedwebstore123.com',
        name: 'Unnamed Webstore',
        phone: '+358 9 123 45678',
    },
};

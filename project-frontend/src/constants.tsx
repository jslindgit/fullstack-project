import { Currency, Config } from './types/types';

export const apiBaseUrl = 'http://localhost:3001/api';
export const pageWidth = 1280;

export const defaultConfig: Config = {
    storeName: 'Webstore',
    currency: Currency.EUR,
    currencyBeforeSum: false,
};

import { Config, Currency } from '../types/types';

export const currency = (amount: number, config: Config): string => {
    const sum: string = (Math.round(amount * 100) / 100).toFixed(2).toString();

    const symbol = (): string => {
        if (config.currency === Currency.EUR) {
            return '€';
        } else if (config.currency === Currency.USD) {
            return '$';
        }
        return config.currency;
    };

    return (config.currencyBeforeSum ? symbol() : '') + sum + (config.currencyBeforeSum ? '' : ' ' + symbol());
};

export default {
    currency,
};

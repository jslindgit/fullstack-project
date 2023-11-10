import { Config, Currency } from '../types/types';

const currency = (amount: number, config: Config): string => {
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

const dateFormat = (date: Date) => {
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
};

export default {
    currency,
    dateFormat,
};

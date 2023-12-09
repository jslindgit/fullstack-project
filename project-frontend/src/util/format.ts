import { Config } from '../types/configTypes';
import { LangCode } from '../types/languageTypes';
import { Currency } from '../types/types';

const currency = (amount: number, config: Config): string => {
    let sum: string = (Math.round(amount * 100) / 100).toFixed(2).toString();

    const symbol = (): string => {
        if (config.currency === Currency.EUR) {
            return '€';
        } else if (config.currency === Currency.USD) {
            return '$';
        }
        return config.currency;
    };

    sum = sum.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    const currencyBeforeSum = [LangCode.ES, LangCode.EN].includes(config.language.code);

    return ((currencyBeforeSum ? symbol() : '') + sum + (currencyBeforeSum ? '' : ' ' + symbol())).replace('.', config.language.decimalPoint);
};

const dateFormat = (date: Date) => {
    return (
        date.getDate() +
        '.' +
        (date.getMonth() + 1) +
        '.' +
        date.getFullYear() +
        ' ' +
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
    );
};

export default {
    currency,
    dateFormat,
};

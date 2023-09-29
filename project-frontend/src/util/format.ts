import { Config } from '../types/types';

export const currency = (amount: number, config: Config): string => {
    const sum: string = (Math.round(amount * 100) / 100).toFixed(2).toString();
    return (config.currencyBeforeSum ? config.currency : '') + sum + (config.currencyBeforeSum ? '' : ' ' + config.currency);
};

export default {
    currency,
};

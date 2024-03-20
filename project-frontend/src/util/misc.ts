import { Item } from '../types/types';

export const imageFilename = (url: string): string => {
    const parts = url.split('/');
    return parts.length > 0 ? parts[parts.length - 1] : '';
};

export const isValidEmailAddress = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    return password.length >= 10;
};

export const isValidUrl = (url: string): boolean => {
    return url.length > 10 && url.includes('://') && url.includes('.');
};

export const itemInStockTotal = (item: Item): number => {
    return item.sizes.reduce((acc, size) => acc + size.instock, 0);
};

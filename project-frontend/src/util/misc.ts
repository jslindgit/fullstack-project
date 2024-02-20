import { Item } from '../types/types';

export const imageFilename = (path: string): string => {
    const parts = path.split('\\');
    return parts.length > 0 ? parts[parts.length - 1] : '';
};

export const imageFullPath = (subdirAndFilename: string) => {
    const baseUrl = (import.meta.env.VITE_ENV as string) === 'dev' ? 'http://localhost:3001/images/' : '/images/';
    const fullpath = baseUrl + subdirAndFilename;
    return fullpath;
};

export const imageSubdir = (path: string): string => {
    const parts = path.split('\\');
    return parts.length > 0 ? parts[0] : '';
};

export const isValidEmailAddress = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string) => {
    return password.length >= 10;
};

export const itemInStockTotal = (item: Item): number => {
    return item.sizes.reduce((acc, size) => acc + size.instock, 0);
};

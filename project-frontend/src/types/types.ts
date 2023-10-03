export interface Category {
    id: number;
    name: string;
    description: string;
    items: Item[];
}

export type NewCategory = Omit<Omit<Category, 'id'>, 'items'>;

export interface Config {
    storeName: string;
    currency: Currency;
    currencyBeforeSum: boolean;
}

export enum Currency {
    EUR = '€',
    USD = '$',
}

export interface Item {
    id: number;
    categories: Category[];
    description: string;
    instock: number;
    name: string;
    price: number;
}

export type NewItem = Omit<Omit<Item, 'id'>, 'categories'>;

export interface LoginResponse {
    success: boolean;
    message: string;
}

export interface Notification {
    tone: 'Positive' | 'Neutral' | 'Negative';
    message: string;
    renders: number;
}

export type NewNotification = Omit<Notification, 'renders'>;

export interface Response {
    success: boolean;
    message: string;
}

export interface User {
    id: number;
    username: string;
    name: string;
    admin: boolean;
    disabled: boolean;
    token: string;
}

export type NewUser = Omit<User, 'id'>;

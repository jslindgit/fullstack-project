export interface Category {
    id: number;
    name: string;
    description: string;
    items: Item[];
}

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
    name: string;
    description: string;
    price: number;
    instock: number;
}

export type NewItem = Omit<Item, 'id'>;

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

export interface User {
    id: number;
    username: string;
    name: string;
    admin: boolean;
    disabled: boolean;
    token: string;
}

export type NewUser = Omit<User, 'id'>;

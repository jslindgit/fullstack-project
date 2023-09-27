export interface Category {
    id: number;
    name: string;
    description: string;
    items: Item[];
}

export interface Config {
    storeName: string;
    currency: Currency;
}

export type Currency = 'EUR' | 'USD';

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    instock: number;
}

export type NewItem = Omit<Item, 'id'>;

export interface LoggedUser {
    token: string;
    username: string;
    admin: boolean;
}

export interface User {
    id: number;
    username: string;
    name: string;
    admin: boolean;
    disabled: boolean;
}

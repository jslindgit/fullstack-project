import { LangText } from './languageTypes';

export interface Category {
    id: number;
    name: LangText[];
    description: LangText[];
    items: Item[];
}
export type NewCategory = Omit<Omit<Category, 'id'>, 'items'>;

export interface Country {
    names: LangText[];
}

export enum Currency {
    EUR = 'EUR',
    USD = 'USD',
}

export interface ImageCategory {
    name: string;
    imagePaths: string[];
}

export interface Item {
    id: number;
    categories: Category[];
    description: LangText[];
    images: string[];
    instock: number;
    name: LangText[];
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
    linkText?: string;
    linkTo?: string;
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

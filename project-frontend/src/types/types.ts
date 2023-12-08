import { LangText } from './languageTypes';
import { Order } from './orderTypes';

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

export type NotificationTone = 'Positive' | 'Neutral' | 'Negative';

export interface Notification {
    tone: NotificationTone;
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
    admin: boolean;
    contactAddress: string;
    contactCity: string;
    contactCountry: string;
    contactFirstName: string;
    contactLastName: string;
    contactOrganization?: string;
    contactPhone: string;
    contactZipcode: string;
    disabled: boolean;
    orders: Array<Order>;
    token: string;
    username: string;
}
export type NewUser = Omit<Omit<User, 'id'>, 'token'> & { password: string };

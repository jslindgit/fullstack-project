import { LangText } from './languageTypes';
import { Order } from './orderTypes';

export interface Category {
    id: number;
    addedBy?: number;
    description: LangText[];
    name: LangText[];
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
    directory: string;
    name: LangText[];
    imagePaths: string[];
}
export interface Item {
    id: number;
    addedBy?: number;
    categories: Category[];
    createdAt: string;
    description: LangText[];
    fitsInLetter: number;
    images: string[];
    instock: number;
    name: LangText[];
    price: number;
    sizes: ItemSizeAndInstock[];
    sold: number;
}
export type NewItem = Omit<Omit<Omit<Omit<Item, 'id'>, 'categories'>, 'sold'>, 'createdAt'>;

export interface ItemSizeAndInstock {
    size: string;
    instock: number;
}

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
    testId?: string;
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
    createdAt: string;
    disabled: boolean;
    operator: boolean;
    orders: Array<Order>;
    token: string;
    username: string;
}
export type NewUser = Omit<Omit<Omit<User, 'id'>, 'token'>, 'createdAt'> & { password: string };

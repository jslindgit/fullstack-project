//import { isLangText } from './languageFunctions';
import { LangText } from './languageTypes';
import { Order } from './orderTypes';
import { isNumber, isObject } from './typeFunctions';

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
    directory: string;
    name: LangText[];
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
    sold: number;
}
export type NewItem = Omit<Omit<Omit<Item, 'id'>, 'categories'>, 'sold'>;

export const isNewItem = (obj: unknown): obj is NewItem => {
    return (
        obj !== null &&
        isObject(obj) &&
        'description' in obj &&
        Array.isArray(obj.description) &&
        //obj.description.every((d) => isLangText(d)) &&
        'images' in obj &&
        Array.isArray(obj.images) &&
        //obj.images.every((i) => isString(i)) &&
        'instock' in obj &&
        isNumber(obj.instock) &&
        'name' in obj &&
        Array.isArray(obj.name) &&
        //obj.name.every((n) => isLangText(n)) &&
        'price' in obj &&
        isNumber(Number(obj.price))
    );
};

export const isItem = (obj: unknown): obj is Item => {
    return isNewItem(obj) && 'id' in obj && isNumber(obj.id) && 'categories' in obj && Array.isArray(obj.categories) && 'sold' in obj && isNumber(obj.sold);
};

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
    operator: boolean;
    orders: Array<Order>;
    token: string;
    username: string;
}
export type NewUser = Omit<Omit<User, 'id'>, 'token'> & { password: string };

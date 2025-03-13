import { LangText } from './languageTypes';
import { Order } from './orderTypes';

import { isLangText } from './languageTypeFunctions';
import { isBoolean, isNumber, isObject, isString } from './typeFunctions';

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

export const isCountry = (obj: unknown): obj is Country => {
    return isObject(obj) && 'names' in obj && isLangText(obj.names);
};

export enum Currency {
    EUR = 'EUR',
    USD = 'USD',
}

export interface ErrorResponse {
    data: object;
    status: number;
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

export interface ItemResponse extends Response {
    item: Item | null;
}

export interface ItemSizeAndInstock {
    size: string;
    instock: number;
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
    status?: number;
}

export const isResponse = (obj: unknown): obj is Response => {
    return isObject(obj) && 'success' in obj && isBoolean(obj.success) && 'message' in obj && isString(obj.message);
};

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

export const isUser = (obj: unknown): obj is User => {
    return (
        isObject(obj) &&
        'id' in obj &&
        isNumber(obj.id) &&
        'admin' in obj &&
        isBoolean(obj.admin) &&
        'contactAddress' in obj &&
        isString(obj.contactAddress) &&
        'contactCity' in obj &&
        isString(obj.contactCity) &&
        'contactCountry' in obj &&
        isString(obj.contactCountry) &&
        'contactFirstName' in obj &&
        isString(obj.contactFirstName) &&
        'contactLastName' in obj &&
        isString(obj.contactLastName) &&
        'contactPhone' in obj &&
        isString(obj.contactPhone) &&
        'contactZipcode' in obj &&
        isString(obj.contactZipcode) &&
        'disabled' in obj &&
        isBoolean(obj.disabled) &&
        'operator' in obj &&
        isBoolean(obj.operator) &&
        'username' in obj &&
        isString(obj.username)
    );
};

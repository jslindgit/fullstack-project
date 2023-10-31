export interface Category {
    id: number;
    name: string;
    description: string;
    items: Item[];
}
export type NewCategory = Omit<Omit<Category, 'id'>, 'items'>;

export interface Config {
    currency: Currency;
    currencyBeforeSum: boolean;
    owner: ConfigOwner;
    paytrail: ConfigPaytrail | null;
    store: ConfigStore;
}

export interface ConfigOwner {
    businessIdentifier: string;
    email: string;
    name: string;
    phone: string;
}

export interface ConfigPaytrail {
    merchantId: string;
    secretKey: string;
}

export interface ConfigStore {
    email: string;
    name: string;
    phone: string;
}

export enum Currency {
    EUR = '€',
    USD = '$',
}

export interface ImageCategory {
    name: string;
    imagePaths: string[];
}

export interface Item {
    id: number;
    categories: Category[];
    description: string;
    images: string[];
    instock: number;
    name: string;
    price: number;
}
export type NewItem = Omit<Omit<Omit<Item, 'id'>, 'categories'>, 'images'>;

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

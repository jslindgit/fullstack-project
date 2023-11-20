export interface Credentials {
    username: string;
    password: string;
}

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    instock: number;
    images: string[];
}
export type NewItem = Omit<Item, 'id'>;

export interface Item_Category {
    id: number;
    itemId: number;
    categoryId: number;
}
export type NewItem_Category = Omit<Item_Category, 'id'>;

export interface User {
    id: number;
    username: string;
    name: string;
    admin: boolean;
    disabled: boolean;
    token: string;
}

export type NewUser = Omit<User, 'id'>;

export interface UserForToken {
    username: string;
    id: number;
}

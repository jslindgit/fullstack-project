export interface Category {
    id: number;
    name: string;
    description: string;
}
export type NewCategory = Omit<Category, 'id'>;

export interface Credentials {
    username: string;
    password: string;
}

export interface Image {
    id: number;
    data: Buffer;
    filename: string;
}
export type NewImage = Omit<Image, 'id'>;

export interface Image_Item {
    id: number;
    imageId: number;
    itemId: number;
}
export type NewImage_Item = Omit<Image_Item, 'id'>;

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    instock: number;
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

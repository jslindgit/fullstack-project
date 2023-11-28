export interface Credentials {
    username: string;
    password: string;
}

export interface Item_Category {
    id: number;
    itemId: number;
    categoryId: number;
}
export type NewItem_Category = Omit<Item_Category, 'id'>;

export interface UserForToken {
    username: string;
    id: number;
}

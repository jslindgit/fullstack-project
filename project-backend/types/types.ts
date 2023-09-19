export interface Category {
    id: number;
    name: string;
    description: string;
}

export type NewCategory = Omit<Category, 'id'>;

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    instock: number;
}

export type NewItem = Omit<Item, 'id'>;

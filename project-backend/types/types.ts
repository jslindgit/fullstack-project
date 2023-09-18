export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    stockbalance: number;
}

export type NewItem = Omit<Item, 'id'>;

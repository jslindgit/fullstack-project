export interface Category {
    id: number;
    name: string;
    description: string;
    items: Item[];
}

export interface Config {
    storeName: string;
}

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    instock: number;
}

export const defaultConfig: Config = {
    storeName: 'Webstore',
};

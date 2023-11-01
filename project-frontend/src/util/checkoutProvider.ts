import { ItemPair } from '../components/ShoppinCart';
import { NewOrder, Order, ShoppingItem } from '../types/orderTypes';

import { handleError } from './handleError';
import itemService from '../services/itemService';
import localstorageHandler from './localstorageHandler';

export const fetchItems = async (): Promise<ItemPair[]> => {
    const shoppingItems = localstorageHandler.getShoppingCart();

    const itemPromises = shoppingItems.map(async (si) => {
        const item = await itemService.getById(si.itemId);
        if (item) {
            return { shoppingItem: si, item: item };
        } else {
            handleError(new Error(`Failed to fetch an Item with id ${si.itemId}!`));
            return null;
        }
    });

    const resolvedItemPairs = await Promise.all(itemPromises);
    const filteredItemPairs = resolvedItemPairs.filter((pair) => pair !== null) as ItemPair[];

    return filteredItemPairs;
};

export const itemsTotalSum = (items: ShoppingItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const orderTotalSum = (order: NewOrder | Order): number => {
    return itemsTotalSum(order.items) + (order.deliveryMethod ? order.deliveryMethod.cost : 0);
};

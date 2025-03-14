import { NewOrder, Order, ShoppingItem } from '../types/orderTypes';
import { StoreDispatch } from '../redux/store';

import { itemGetById } from '../redux/slices/itemSlice';

export const itemsTotalSum = (items: ShoppingItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const orderFitsInLetter = async (order: NewOrder | Order, storeDispatch: StoreDispatch): Promise<boolean> => {
    let letterFullness = 0.0;

    for (const shoppingItem of order.items) {
        const item = await storeDispatch(itemGetById.initiate(shoppingItem.id)).unwrap();

        if (!item || item.fitsInLetter < 1) {
            return false;
        } else {
            letterFullness += shoppingItem.quantity / item.fitsInLetter;
        }

        if (letterFullness > 1) {
            break;
        }
    }

    return letterFullness <= 1;
};

export const orderTotalSum = (order: NewOrder | Order): number => {
    return itemsTotalSum(order.items) + Number(order.deliveryCost);
};

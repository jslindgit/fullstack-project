import { NewOrder, Order, ShoppingItem } from '../types/orderTypes';

export const itemsTotalSum = (items: ShoppingItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const orderTotalSum = (order: NewOrder | Order): number => {
    return itemsTotalSum(order.items) + Number(order.deliveryCost);
};

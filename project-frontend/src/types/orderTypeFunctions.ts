import { NewOrder, Order, ShoppingItem } from './orderTypes';

import { isNumber, isObject, isString } from './typeFunctions';

const isNewOrder = (obj: unknown): obj is NewOrder => {
    return (
        isObject(obj) &&
        'customerAddress' in obj &&
        isString(obj.customerAddress) &&
        'customerCity' in obj &&
        isString(obj.customerCity) &&
        'customerCountry' in obj &&
        isString(obj.customerCountry) &&
        'customerEmail' in obj &&
        isString(obj.customerEmail) &&
        'customerFirstName' in obj &&
        isString(obj.customerFirstName) &&
        'customerLastName' in obj &&
        isString(obj.customerLastName) &&
        'customerPhone' in obj &&
        isString(obj.customerPhone) &&
        'customerZipCode' in obj &&
        isString(obj.customerZipCode) &&
        'deliveryCost' in obj &&
        isNumber(obj.deliveryCost) &&
        'deliveryMethod' in obj &&
        'items' in obj &&
        Array.isArray(obj.items) &&
        'language' in obj &&
        'paymentMethod' in obj &&
        'status' in obj
    );
};

export const isOrder = (obj: unknown): obj is Order => {
    return obj !== null && isNewOrder(obj) && 'id' in obj && isNumber(obj.id) && 'createdAt' in obj && 'totalAmount' in obj && isNumber(obj.totalAmount);
};

export const isOrderOrNewOrder = (obj: unknown): obj is Order | NewOrder => {
    return (obj !== null && isNewOrder(obj)) || isOrder(obj);
};

export const isShoppingItem = (obj: object): obj is ShoppingItem => {
    return (
        isObject(obj) &&
        'id' in obj &&
        isNumber(obj.id) &&
        'name' in obj &&
        isString(obj.name) &&
        'price' in obj &&
        isNumber(obj.price) &&
        'quantity' in obj &&
        isNumber(obj.quantity) &&
        'size' in obj &&
        isString(obj.size)
    );
};

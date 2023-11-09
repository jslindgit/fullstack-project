import { NewOrder, Order } from '../types/orderTypes';

import { isOrderOrNewOrder } from '../types/orderTypeFunctions';

const getOrder = (): Order | NewOrder | null => {
    const order = localStorage.getItem('order');
    if (order) {
        const orderObj = JSON.parse(order);
        if (isOrderOrNewOrder(orderObj)) {
            return orderObj;
        } else {
            localStorage.removeItem('order');
        }
    }
    return null;
};

const setOrder = (order: Order | NewOrder | null) => {
    if (order) {
        localStorage.setItem('order', JSON.stringify(order));
    } else {
        localStorage.removeItem('order');
    }
};

export default {
    getOrder,
    setOrder,
};

import { Order } from '../types/orderTypes';

const getOrder = (): Order | null => {
    const order = localStorage.getItem('order');
    if (order) {
        return JSON.parse(order);
    }
    return null;
};

const setOrder = (order: Order) => {
    localStorage.setItem('order', JSON.stringify(order));
};

export default {
    getOrder,
    setOrder,
};

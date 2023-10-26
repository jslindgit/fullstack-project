import { NewOrder, Order } from '../types/orderTypes';

const getOrder = (): Order | NewOrder | null => {
    const order = localStorage.getItem('order');
    if (order) {
        return JSON.parse(order);
    }
    return null;
};

const setOrder = (order: Order | NewOrder) => {
    localStorage.setItem('order', JSON.stringify(order));
};

export default {
    getOrder,
    setOrder,
};

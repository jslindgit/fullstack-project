import { NewOrder, Order } from '../types/orderTypes';

const getOrder = (): Order | NewOrder | null => {
    const order = localStorage.getItem('order');
    if (order) {
        return JSON.parse(order);
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

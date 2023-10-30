import { NewOrder, Order, OrderValidationError } from './orderTypes';

import { isValidEmailAddress } from '../util/misc';

export const validateOrder = (order: NewOrder | Order): OrderValidationError[] => {
    const errors: OrderValidationError[] = [];

    if (
        !order.customer ||
        order.customer.address.length < 1 ||
        order.customer.city.length < 1 ||
        order.customer.country.length < 1 ||
        order.customer.email.length < 1 ||
        order.customer.firstname.length < 1 ||
        order.customer.lastname.length < 1 ||
        order.customer.phone.length < 1 ||
        order.customer.zipcode.length < 1
    ) {
        errors.push(OrderValidationError.LackingRequiredCustomerInfo);
    } else {
        if (!isValidEmailAddress(order.customer.email)) {
            errors.push(OrderValidationError.InvalidEmailAddress);
        }
    }

    return errors;
};

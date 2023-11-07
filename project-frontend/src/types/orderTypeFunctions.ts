import { Config } from './types';
import { NewOrder, Order, OrderStatus, OrderValidationError } from './orderTypes';

import { isValidEmailAddress } from '../util/misc';
import { orderTotalSum } from '../util/checkoutProvider';

export const getEmptyOrder = (): NewOrder => {
    const order: NewOrder = {
        customerAddress: '',
        customerCity: '',
        customerCountry: '',
        customerEmail: '',
        customerFirstName: '',
        customerLastName: '',
        customerOrganization: '',
        customerPhone: '',
        customerZipCode: '',
        deliveryCost: 0,
        deliveryMethod: null,
        items: [],
        language: 'FI',
        paymentMethod: null,
        status: OrderStatus.PENDING,
    };

    return order;
};

export const orderToRequestBody = (order: NewOrder | Order, config: Config): object => {
    return {
        ...order,
        currency: 'EUR',
        deliveryMethod: order.deliveryMethod?.name,
        items: JSON.stringify([...order.items, { itemId: 0, name: order.deliveryMethod?.name, price: order.deliveryCost, quantity: 1 }]),
        language: config.language.paytrailValue,
        totalAmount: orderTotalSum(order),
    };
};

export const validateOrder = (order: NewOrder | Order): OrderValidationError[] => {
    const errors: OrderValidationError[] = [];

    if (
        order.customerAddress.length < 1 ||
        order.customerCity.length < 1 ||
        order.customerCountry.length < 1 ||
        order.customerEmail.length < 1 ||
        order.customerFirstName.length < 1 ||
        order.customerLastName.length < 1 ||
        order.customerPhone.length < 1 ||
        order.customerZipCode.length < 1
    ) {
        errors.push(OrderValidationError.LackingRequiredCustomerInfo);
    } else {
        if (!isValidEmailAddress(order.customerEmail)) {
            errors.push(OrderValidationError.InvalidEmailAddress);
        }
    }

    if (!order.deliveryMethod) {
        errors.push(OrderValidationError.DeliveryMethodMissing);
    }

    return errors;
};

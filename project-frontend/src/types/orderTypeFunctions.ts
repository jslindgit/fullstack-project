import { Config, Item } from './types';
import { NewOrder, Order, OrderStatus, OrderValidationError, ShoppingItem } from './orderTypes';
import { AxiosResponse } from 'axios';

import { isValidEmailAddress } from '../util/misc';
import { orderTotalSum } from '../util/checkoutProvider';
import { isString } from './typeFunctions';

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
    // The delivery method needs to be added to the 'items' array for Paytrail, as the sum of the prices of items in the order must match the total sum of the order:
    const deliveryItem: ShoppingItem = { id: 0, name: order.deliveryMethod ? order.deliveryMethod.name : 'Delivery', price: order.deliveryCost, quantity: 1 };

    return {
        ...order,
        currency: 'EUR',
        deliveryMethod: order.deliveryMethod ? JSON.stringify(order.deliveryMethod) : '',
        items: JSON.stringify([...order.items, deliveryItem]),
        language: config.language.paytrailValue,
        totalAmount: orderTotalSum(order),
    };
};

export const orderFromResponseBody = (res: AxiosResponse): Order => {
    const delivery = 'deliveryMethod' in res.data ? res.data.deliveryMethod : null;
    const payment = 'paymentMethod' in res.data ? res.data.paymentMethod : null;
    const items: Item[] = JSON.parse(res.data.items) as Item[];

    // Remove the delivery method from the 'items' array (which was added there for Paytrail):
    const filteredItems = items.filter((item) => item.id > 0);

    return {
        ...res.data,
        deliveryMethod: delivery && isString(delivery) && delivery.length > 0 ? JSON.parse(delivery) : null,
        items: filteredItems,
        paymentMethod: payment && isString(payment) && payment.length > 0 ? payment : null,
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

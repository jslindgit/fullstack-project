import { Config } from './types';
import { NewOrder, Order, OrderStatus, OrderStatusForAdmin, OrderValidationError, ShoppingItem } from './orderTypes';

import { isValidEmailAddress } from '../util/misc';
import { orderTotalSum } from '../util/checkoutProvider';
import { isObject, isString } from './typeFunctions';
import { langTextsToText } from './languageFunctions';

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
        statusForAdmin: OrderStatusForAdmin.NEW,
    };

    return order;
};

export const isOrderOrNewOrder = (obj: unknown): obj is Order | NewOrder => {
    return (
        isObject(obj) &&
        'customerAddress' in obj &&
        'customerCity' in obj &&
        'customerCountry' in obj &&
        'customerEmail' in obj &&
        'customerFirstName' in obj &&
        'customerLastName' in obj &&
        'customerPhone' in obj &&
        'customerZipCode' in obj &&
        'deliveryCost' in obj &&
        'deliveryMethod' in obj &&
        'items' in obj &&
        'language' in obj &&
        'paymentMethod' in obj &&
        'status' in obj
    );
};

export const orderToRequestBody = (order: NewOrder | Order, config: Config): object => {
    // The delivery method needs to be added to the 'items' array for Paytrail, as the sum of the prices of items in the order must match the total sum of the order:
    const deliveryItem: ShoppingItem = { id: 0, name: order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, config) : 'Delivery', price: order.deliveryCost, quantity: 1 };

    return {
        ...order,
        currency: 'EUR',
        deliveryMethod: order.deliveryMethod ? JSON.stringify(order.deliveryMethod) : '',
        items: JSON.stringify([...order.items, deliveryItem]),
        language: config.language.paytrailValue,
        totalAmount: orderTotalSum(order),
    };
};

export const orderFromResponseBody = (responseBody: unknown): Order => {
    if (!isObject(responseBody)) {
        throw new Error('responseBody is not an object');
    }

    const delivery = 'deliveryMethod' in responseBody ? responseBody.deliveryMethod : null;
    const payment = 'paymentMethod' in responseBody ? responseBody.paymentMethod : null;
    const items: ShoppingItem[] = 'items' in responseBody && isString(responseBody.items) ? (JSON.parse(responseBody.items) as ShoppingItem[]) : [];

    // Remove the delivery method from the 'items' array (which was added there for Paytrail):
    const filteredItems = items.filter((item) => item.id > 0);

    return {
        ...(responseBody as Order),
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

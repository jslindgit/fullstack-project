import { Config } from './configTypes';
import { ContentID } from '../content';
import { NewOrder, Order, OrderStatus, OrderStatusForAdmin, ShoppingItem } from './orderTypes';

import { orderTotalSum } from '../util/checkoutProvider';
import { contentToText, langTextsToText } from './languageFunctions';
import { isValidEmailAddress } from '../util/misc';
import { isNumber, isObject, isString } from './typeFunctions';

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

export const isOrder = (obj: unknown): obj is Order => {
    return (
        isObject(obj) &&
        'id' in obj &&
        isNumber(obj.id) &&
        'createdAt' in obj &&
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
        Array.isArray(obj.items) &&
        'language' in obj &&
        'paymentMethod' in obj &&
        'status' in obj &&
        'totalAmount' in obj &&
        isNumber(obj.totalAmount)
    );
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
        isNumber(obj.quantity)
    );
};

export const orderToRequestBody = (order: NewOrder | Order, config: Config, addDeliveryMethodToItems: boolean): object => {
    const orderItems: ShoppingItem[] = [...order.items];

    if (addDeliveryMethodToItems) {
        // The delivery method needs to be added to the 'items' array when making a payment request for Paytrail, as the sum of the prices of items in the order must match the total sum of the order:
        const deliveryItem: ShoppingItem = {
            id: 0,
            name: order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, config) : 'Delivery',
            price: order.deliveryCost,
            quantity: 1,
        };

        orderItems.push(deliveryItem);
    }

    return {
        ...order,
        currency: 'EUR',
        deliveryCost: Number(order.deliveryCost),
        deliveryMethod: order.deliveryMethod ? JSON.stringify(order.deliveryMethod) : '',
        items: JSON.stringify(orderItems),
        language: config.language.paytrailValue,
        totalAmount: orderTotalSum(order),
    };
};

export const orderFromResponseBody = (resBody: unknown): Order => {
    console.log('resBody:', resBody);
    if (!isObject(resBody)) {
        throw new Error('responseBody is not an object');
    }

    const delivery = 'deliveryMethod' in resBody ? resBody.deliveryMethod : null;
    const items: ShoppingItem[] = 'items' in resBody && isString(resBody.items) ? (JSON.parse(resBody.items) as ShoppingItem[]) : [];
    const payment = 'paymentMethod' in resBody ? resBody.paymentMethod : null;

    if (!('deliveryCost' in resBody && 'totalAmount' in resBody)) {
        throw new Error('resBody is not an Order');
    }

    // Remove the delivery method from the 'items' array (which was added there for Paytrail):
    const filteredItems = items.filter((item) => item.id > 0);

    return {
        ...(resBody as Order),
        deliveryCost: Number(resBody.deliveryCost),
        deliveryMethod: delivery && isString(delivery) && delivery.length > 0 ? JSON.parse(delivery) : null,
        items: filteredItems,
        paymentMethod: payment && isString(payment) && payment.length > 0 ? payment : null,
        totalAmount: Number(resBody.totalAmount),
    };
};

export const getOrderStatus = (status: OrderStatus, config: Config): string => {
    switch (status) {
        case OrderStatus.CANCELLED:
            return contentToText(ContentID.statusCancelled, config);
        case OrderStatus.COMPLETED:
            return contentToText(ContentID.statusCompleted, config);
        case OrderStatus.DELIVERED:
            return contentToText(ContentID.statusDelivered, config);
        case OrderStatus.PENDING:
            return contentToText(ContentID.statusPending, config);
        case OrderStatus.PROCESSING:
            return contentToText(ContentID.statusProcessing, config);
        case OrderStatus.REFUNDED:
            return contentToText(ContentID.statusRefunded, config);
        case OrderStatus.SHIPPED:
            return contentToText(ContentID.statusShipped, config);
        default:
            return '';
    }
};

export const validateOrder = (order: NewOrder | Order, config: Config): string[] => {
    const errors: string[] = [];

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
        errors.push(contentToText(ContentID.checkOutCustomerContactInformation, config));
    } else {
        if (!isValidEmailAddress(order.customerEmail)) {
            errors.push(contentToText(ContentID.checkOutInvalidEmail, config));
        }
    }

    if (!order.deliveryMethod) {
        errors.push(contentToText(ContentID.checkOutChooseDeliveryMethod, config));
    }

    return errors;
};

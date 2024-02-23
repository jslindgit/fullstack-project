import { Config } from './configTypes';
import { ContentID } from '../content';
import { NewOrder, Order, OrderStatus, ShoppingItem } from './orderTypes';

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
    };

    return order;
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
            return contentToText(ContentID.statusDelivered, config);
        default:
            return '';
    }
};

export const getOrderStatusForAdmin = (order: Order, config: Config): string => {
    if (order.recycledDate) {
        return contentToText(ContentID.orderStatusForAdminRecycled, config);
    } else if (order.deliveredDate) {
        return contentToText(ContentID.orderStatusForAdminDelivered, config);
    } else if (order.printedOutDate) {
        return contentToText(ContentID.orderStatusForAdminPrinted, config);
    } else if (order.readDate) {
        return contentToText(ContentID.orderStatusForAdminRead, config);
    } else {
        return contentToText(ContentID.orderStatusForAdminNew, config);
    }
};

export const isNewOrder = (obj: unknown): obj is NewOrder => {
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
    return isNewOrder(obj) && 'id' in obj && isNumber(obj.id) && 'createdAt' in obj && 'totalAmount' in obj && isNumber(obj.totalAmount);
};

export const isOrderOrNewOrder = (obj: unknown): obj is Order | NewOrder => {
    return isNewOrder(obj) || isOrder(obj);
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

export const orderToRequestBody = (order: NewOrder | Order, config: Config, addDeliveryMethodToItems: boolean, userId: number | null): object => {
    const orderItems: ShoppingItem[] = [...order.items];

    if (addDeliveryMethodToItems) {
        // The delivery method needs to be added to the 'items' array when making a payment request for Paytrail, as the sum of the prices of items in the order must match the total sum of the order:
        const deliveryItem: ShoppingItem = {
            id: 0,
            name: order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, config) : 'Delivery',
            price: order.deliveryCost,
            quantity: 1,
            size: '',
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
        userId: userId,
    };
};

export const orderFromResponseBody = (resBody: unknown): Order => {
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

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { NewOrder, Order, OrderStatus, ShoppingItem } from '../types/orderTypes';

import { orderTotalSum } from './checkoutProvider';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { isValidEmailAddress } from './misc';
import { isObject, isString } from '../types/typeFunctions';

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

export const orderFromResponseBody = (resBody: unknown): Order | null => {
    if (!isObject(resBody)) {
        return null;
    }

    const delivery = 'deliveryMethod' in resBody ? resBody.deliveryMethod : null;
    const items: ShoppingItem[] = 'items' in resBody && isString(resBody.items) ? (JSON.parse(resBody.items) as ShoppingItem[]) : [];
    const payment = 'paymentMethod' in resBody ? resBody.paymentMethod : null;

    if (!('deliveryCost' in resBody && 'totalAmount' in resBody)) {
        return null;
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

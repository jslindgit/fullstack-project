import React from 'react';

import { Config } from '../types/configTypes';
import { Order, ShoppingItem } from '../types/orderTypes';

import format from '../util/format';
import { isString } from '../types/typeFunctions';

interface Props {
    config: Config;
    order: Order;
}

const UserOrderDetails = ({ order, config }: Props) => {
    const parsedOrder = { ...order, items: isString(order.items) ? (JSON.parse(order.items) as ShoppingItem[]) : order.items };

    return (
        <table width='100%'>
            <tbody>
                {parsedOrder.items.map((item) => (
                    <React.Fragment key={item.id}>
                        <tr>
                            <td>{item.name}</td>
                            <td>{format.currency(item.price, config)}</td>
                            <td>{item.quantity}</td>
                            <td>{format.currency(item.price * item.quantity, config)}</td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default UserOrderDetails;

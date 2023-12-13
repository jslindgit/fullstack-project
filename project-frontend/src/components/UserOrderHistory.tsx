import React, { useState } from 'react';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { Order } from '../types/orderTypes';
import { User } from '../types/types';

import format from '../util/format';
import { contentToText } from '../types/languageFunctions';
import { getOrderStatus } from '../types/orderTypeFunctions';

import UserOrderDetails from './UserOrderDetails';

interface Props {
    config: Config;
    user: User;
    width: number;
}
const UserOrderHistory = ({ config, user, width }: Props) => {
    const [hoveredButton, setHoveredButton] = useState<Order | null>(null);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);

    return (
        <table align='center' width={width} className='infoBox'>
            <tbody>
                <tr>
                    <td>
                        <div className='infoHeader underlined'>{contentToText(ContentID.accountOrderHistory, config)}</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        {user && user.orders && user.orders.length > 0 ? (
                            <table width='100%' className='headerRow striped'>
                                <tbody>
                                    <tr>
                                        <td>{contentToText(ContentID.miscDate, config)}&emsp;&emsp;</td>
                                        <td>{contentToText(ContentID.orderId, config)}&emsp;&emsp;</td>
                                        <td>{contentToText(ContentID.orderTotalAmount, config)}</td>
                                        <td>{contentToText(ContentID.orderStatus, config)}</td>
                                        <td className='widthByContent'></td>
                                    </tr>
                                    {[...user.orders]
                                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                                        .map((order) => (
                                            <React.Fragment key={order.id}>
                                                <tr
                                                    className={
                                                        openedOrder === order
                                                            ? 'userOrderHistoryRowOpened'
                                                            : 'hoverableRow' + (hoveredButton === order ? ' hover' : '')
                                                    }
                                                >
                                                    <td>{format.dateFormat(new Date(order.createdAt))}</td>
                                                    <td>{order.id}</td>
                                                    <td>{format.currency(order.totalAmount, config)}</td>
                                                    <td>{getOrderStatus(order.status, config)}</td>
                                                    <td>
                                                        <button
                                                            type='button'
                                                            onClick={() => setOpenedOrder(openedOrder !== order ? order : null)}
                                                            onMouseLeave={() => setHoveredButton(null)}
                                                            onMouseOver={() => setHoveredButton(order)}
                                                        >
                                                            {contentToText(openedOrder === order ? ContentID.buttonClose : ContentID.buttonShowInfo, config)}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {openedOrder === order ? (
                                                    <tr>
                                                        <td colSpan={5} style={{ padding: 0 }}>
                                                            <UserOrderDetails order={order} config={config} />
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    ''
                                                )}
                                            </React.Fragment>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>{contentToText(ContentID.adminOrdersNoOrders, config)}</div>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default UserOrderHistory;

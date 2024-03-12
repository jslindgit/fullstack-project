import React, { useState } from 'react';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { User } from '../../types/types';

import format from '../../util/format';
import { contentToText } from '../../types/languageFunctions';
import { getOrderStatus } from '../../util/orderProvider';

import UserOrderDetails from './UserOrderDetails';

interface Props {
    config: Config;
    user: User;
}
const UserOrderHistory = ({ config, user }: Props) => {
    const [hoveredButton, setHoveredButton] = useState<Order | null>(null);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);

    let stripedRow = 'stripedRowEven';
    const getStripedRowClassName = () => {
        stripedRow = stripedRow === 'stripedRowEven' ? 'stripedRowOdd' : 'stripedRowEven';
        return stripedRow;
    };

    return (
        <div className='infoBox'>
            <div className='infoHeader'>{contentToText(ContentID.accountOrderHistory, config)}</div>
            {user && user.orders && user.orders.length > 0 ? (
                <table width='100%' className='headerRow'>
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
                                            getStripedRowClassName() +
                                            ' ' +
                                            (openedOrder === order ? 'userOrderHistoryRowOpened' : 'hoverableRow' + (hoveredButton === order ? ' hover' : ''))
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
                                            <td className='padding0' colSpan={5}>
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
        </div>
    );
};

export default UserOrderHistory;

import { useState } from 'react';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import format from '../util/format';
import { contentToText } from '../types/languageFunctions';
import { getOrderStatus } from '../types/orderTypeFunctions';

interface Props {
    config: Config;
    user: User;
    width: number;
}
const UserOrderHistory = ({ config, user, width }: Props) => {
    const [hoveredOrder, setHoveredOrder] = useState<number>(-1);

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
                        {user.orders.length > 0 ? (
                            <table width='100%' className='headerRow striped'>
                                <tbody>
                                    <tr>
                                        <td>{contentToText(ContentID.miscDate, config)}&emsp;&emsp;</td>
                                        <td>{contentToText(ContentID.orderId, config)}&emsp;&emsp;</td>
                                        <td>{contentToText(ContentID.orderTotalAmount, config)}</td>
                                        <td>{contentToText(ContentID.orderStatus, config)}</td>
                                        <td className='widthByContent'></td>
                                    </tr>
                                    {user.orders.map((order) => (
                                        <tr key={order.id} className={hoveredOrder === order.id ? 'orderHistoryHover' : 'orderHistoryNotHovered'}>
                                            <td>{format.dateFormat(new Date(order.createdAt))}</td>
                                            <td>{order.id}</td>
                                            <td>{format.currency(order.totalAmount, config)}</td>
                                            <td>{getOrderStatus(order.status, config)}</td>
                                            <td>
                                                <button type='button' onMouseLeave={() => setHoveredOrder(-1)} onMouseOver={() => setHoveredOrder(order.id)}>
                                                    {contentToText(ContentID.buttonShowInfo, config)}
                                                </button>
                                            </td>
                                        </tr>
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

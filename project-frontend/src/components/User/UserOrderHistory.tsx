import { useState } from 'react';

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
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);

    return (
        <div className='infoBox userOrderHistory'>
            <div className='infoHeader'>{contentToText(ContentID.accountOrderHistory, config)}</div>
            {user && user.orders && user.orders.length > 0 ? (
                <>
                    <div className='grid-container left middle padded1rem stripedBackground' data-cols='order-history'>
                        <div className='displayContents gridHeaderRowDarkGray'>
                            <div>{contentToText(ContentID.miscDate, config)}</div>
                            <div>{contentToText(ContentID.orderId, config)}</div>
                            <div>{contentToText(ContentID.orderTotalAmount, config)}</div>
                            <div>{contentToText(ContentID.orderStatus, config)}</div>
                            <div />
                        </div>
                        {[...user.orders]
                            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                            .map((order) => (
                                <div key={order.id} className={'displayContents ' + (openedOrder === order ? 'userOrderHistoryRowOpened' : 'buttonHighlight')}>
                                    <div>{format.dateFormat(new Date(order.createdAt))}</div>
                                    <div>{order.id}</div>
                                    <div>{format.currency(order.totalAmount, config)}</div>
                                    <div>{getOrderStatus(order.status, config)}</div>
                                    <div className='alignRight'>
                                        <button type='button' onClick={() => setOpenedOrder(openedOrder !== order ? order : null)}>
                                            {contentToText(openedOrder === order ? ContentID.buttonClose : ContentID.buttonShowInfo, config)}
                                        </button>
                                    </div>
                                    {openedOrder === order && (
                                        <div className='gridSpan5 padding0Important'>
                                            <UserOrderDetails order={order} config={config} />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </>
            ) : (
                <div>{contentToText(ContentID.adminOrdersNoOrders, config)}</div>
            )}
        </div>
    );
};

export default UserOrderHistory;

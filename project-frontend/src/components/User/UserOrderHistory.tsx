import { useEffect, useState } from 'react';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { Order, OrderStatus } from '../../types/orderTypes';
import { User } from '../../types/types';

import format from '../../util/format';
import { contentToText } from '../../types/languageFunctions';
import { getOrderStatus } from '../../util/orderProvider';
import userService from '../../services/userService';

import Loading from '../Loading';
import UserOrderDetails from './UserOrderDetails';

interface Props {
    config: Config;
    userId: number;
}
const UserOrderHistory = ({ config, userId }: Props) => {
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);
    const [paidOrders, setPaidOrders] = useState<Order[]>([]);
    const [user, setUser] = useState<User | undefined>(undefined);

    // Fetch User from server:
    useEffect(() => {
        userService.getById(userId).then((returnedUser) => {
            setUser(returnedUser);
        });
    }, [userId]);

    // Don't include cancelled or pending (unpaid) orders:
    useEffect(() => {
        if (user && user.orders) {
            setPaidOrders(user.orders.filter((o) => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.PENDING));
        }
    }, [user]);

    if (!user || user === null) {
        return <Loading config={config} />;
    }

    return (
        <div className='infoBox userOrderHistory'>
            <div className='infoHeader'>{contentToText(ContentID.accountOrderHistory, config)}</div>
            {paidOrders.length > 0 ? (
                <>
                    <div className='grid-container left middle stripedBackground' data-cols='order-history'>
                        <div className='displayContents gridHeaderRowDarkGray'>
                            <div>{contentToText(ContentID.miscDate, config)}</div>
                            <div>{contentToText(ContentID.orderId, config)}</div>
                            <div>{contentToText(ContentID.orderTotalAmount, config)}</div>
                            <div>{contentToText(ContentID.orderStatus, config)}</div>
                            <div />
                        </div>
                        {[...paidOrders]
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
                <div className='sizeLarge'>{contentToText(ContentID.adminOrdersNoOrders, config)}</div>
            )}
        </div>
    );
};

export default UserOrderHistory;

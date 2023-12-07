import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import { setNotification } from '../../reducers/miscReducer';

import { contentToText } from '../../types/languageFunctions';
import orderService from '../../services/orderService';

import AdminOrderDetails from './AdminOrderDetails';
import AdminOrderRow from './AdminOrderRow';

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const fetch = async () => {
        const data = await orderService.getAll();
        setOrders(data.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    };

    useEffect(() => {
        fetch();

        document.title = `${contentToText(ContentID.adminPanelHeader, config)} - ${contentToText(ContentID.adminPanelOrders, config)} (${orders.length})`;
    }, [config, orders.length]);

    const deleteOrder = async (order: Order) => {
        if (
            usersState.loggedUser?.admin &&
            confirm(`${contentToText(ContentID.adminOrdersDeleteOrder, config)} ${order.id} (${order.customerFirstName} ${order.customerLastName})?`)
        ) {
            setOpenedOrder(null);
            const res = await orderService.deleteOrder(order, usersState.loggedUser?.token);
            await fetch();
            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));
        }
    };

    const orderRow = (order: Order) => {
        return openedOrder === order ? (
            <React.Fragment key={order.id}>
                <AdminOrderRow key={order.id} order={order} openedOrder={openedOrder} setOpenedOrder={setOpenedOrder} />
                <AdminOrderDetails order={order} deleteOrder={deleteOrder} />
            </React.Fragment>
        ) : (
            <AdminOrderRow key={order.id} order={order} openedOrder={openedOrder} setOpenedOrder={setOpenedOrder} />
        );
    };

    return (
        <div>
            <table align='center' width='100%' className='adminOrdersMenu'>
                <tbody>
                    <tr>
                        <td>{contentToText(ContentID.adminOrdersProcessing, config)}</td>
                        <td width='1px' className='colorGrayLight bold'>
                            |
                        </td>
                        <td>{contentToText(ContentID.adminOrdersDelivered, config)}</td>
                        <td width='1px' className='colorGrayLight bold'>
                            |
                        </td>
                        <td>{contentToText(ContentID.miscRecycleBin, config)}</td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width='100%' className='adminOrders striped'>
                <tbody>
                    <tr>
                        <td>{contentToText(ContentID.miscDate, config)}</td>
                        <td>{contentToText(ContentID.orderCustomer, config)}</td>
                        <td>{contentToText(ContentID.orderTotalAmount, config)}</td>
                        <td>{contentToText(ContentID.orderDeliveryMethod, config)}</td>
                        <td>{contentToText(ContentID.orderStatus, config)}</td>
                        <td width='1px'></td>
                    </tr>
                    {orders.length > 0 ? (
                        orders.map((order) => orderRow(order))
                    ) : (
                        <tr>
                            <td colSpan={6} className='alignCenter centered semiBold sizeLarge'>
                                <br />
                                {contentToText(ContentID.adminOrdersNoOrders, config)}
                                <br />
                                <br />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;

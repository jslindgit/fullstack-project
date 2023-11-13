import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import { setNotification } from '../../reducers/miscReducer';

import orderService from '../../services/orderService';

import AdminOrderDetails from './AdminOrderDetails';
import AdminOrderRow from './AdminOrderRow';

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);

    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

    const fetch = async () => {
        const data = await orderService.getAll();
        setOrders(data.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    };

    useEffect(() => {
        fetch();
    }, []);

    const deleteOrder = async (order: Order) => {
        if (usersState.loggedUser?.admin && confirm(`Delete order number ${order.id} (${order.customerFirstName} ${order.customerLastName})?`)) {
            setOpenedOrder(null);
            const res = await orderService.deleteOrder(order, usersState.loggedUser?.token);
            await fetch();
            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
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
                        <td>In processing</td>
                        <td width='1px'>|</td>
                        <td>Recently delivered</td>
                        <td width='1px'>|</td>
                        <td>Archived</td>
                        <td width='1px'>|</td>
                        <td>Recycle bin</td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width='100%' className='adminOrders striped'>
                <tbody>
                    <tr>
                        <td>Date</td>
                        <td>Customer</td>
                        <td>Total Sum</td>
                        <td>Delivery</td>
                        <td>Status</td>
                        <td width='1px'></td>
                    </tr>
                    {orders.length > 0 ? (
                        orders.map((order) => orderRow(order))
                    ) : (
                        <tr>
                            <td colSpan={6} className='centered sizeLarge'>
                                <br />
                                No orders
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

import React from 'react';
import { useEffect, useState } from 'react';

import { Order } from '../../types/orderTypes';

import orderService from '../../services/orderService';

import AdminOrderDetails from './AdminOrderDetails';
import AdminOrderRow from './AdminOrderRow';

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [openedOrder, setOpenedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await orderService.getAll();
            setOrders(data);
        };
        fetch();
    }, []);

    const orderRow = (order: Order) => {
        return openedOrder === order ? (
            <React.Fragment key={order.id}>
                <AdminOrderRow key={order.id} order={order} openedOrder={openedOrder} setOpenedOrder={setOpenedOrder} />
                <AdminOrderDetails order={order} />
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
                    </tr>
                </tbody>
            </table>
            <table align='center' width='100%' className='adminOrders striped'>
                <tbody>
                    <tr>
                        <td>Date</td>
                        <td>Customer</td>
                        <td>Delivery</td>
                        <td>Sum</td>
                        <td>Status</td>
                        <td></td>
                    </tr>
                    {orders.map((order) => orderRow(order))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;

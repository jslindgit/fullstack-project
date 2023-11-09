import { useEffect, useState } from 'react';

import { Order } from '../../types/orderTypes';

import orderService from '../../services/orderService';

import AdminOrderItem from './AdminOrderItem';

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await orderService.getAll();
            setOrders(data);
        };
        fetch();
    }, []);

    return (
        <div>
            <table align='center' width='100%'>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>
                                <AdminOrderItem order={order} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;

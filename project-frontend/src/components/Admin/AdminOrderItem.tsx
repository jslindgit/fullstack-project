import { useSelector } from 'react-redux';

import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';

interface Props {
    order: Order;
}

const AdminOrderItem = ({ order }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    const date = new Date(order.createdAt);
    const dateString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    return (
        <table width='100%' className='orderItem'>
            <tbody>
                <tr>
                    <td>{dateString}</td>
                    <td>
                        {order.customerFirstName} {order.customerLastName}
                    </td>
                    <td>{format.currency(order.totalAmount, configState)}</td>
                    <td>{order.status}</td>
                    <td>
                        <button type='button'>Open</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default AdminOrderItem;

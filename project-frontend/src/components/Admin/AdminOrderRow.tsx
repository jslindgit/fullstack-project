import { useSelector } from 'react-redux';

import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';

interface Props {
    order: Order;
    openedOrder: Order | null;
    setOpenedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

const AdminOrderRow = ({ order, openedOrder, setOpenedOrder }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    const date = new Date(order.createdAt);
    const dateString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

    const isOpened = openedOrder === order;

    return (
        <tr className={isOpened ? 'adminOrdersOpened' : ''}>
            <td>{dateString}</td>
            <td>
                {order.customerFirstName} {order.customerLastName}
            </td>
            <td>{order.deliveryMethod?.name}</td>
            <td>{format.currency(order.totalAmount, configState)}</td>
            <td>{order.status}</td>
            <td>
                {isOpened ? (
                    <button type='button' onClick={() => setOpenedOrder(null)}>
                        Close
                    </button>
                ) : (
                    <button type='button' onClick={() => setOpenedOrder(order)}>
                        Open
                    </button>
                )}
            </td>
        </tr>
    );
};

export default AdminOrderRow;

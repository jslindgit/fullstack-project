import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Order, OrderStatusForAdmin } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

interface Props {
    order: Order;
    openedOrder: Order | null;
    setOpenedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

const AdminOrderRow = ({ order, openedOrder, setOpenedOrder }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const date = new Date(order.createdAt);

    const isOpened = openedOrder === order;

    return (
        <tr className={(isOpened ? 'adminOrdersOpened' : '') + (order.statusForAdmin === OrderStatusForAdmin.NEW ? ' semiBold' : '')}>
            <td>{format.dateFormat(date)}</td>
            <td>
                {order.customerFirstName} {order.customerLastName}
            </td>
            <td>{format.currency(order.totalAmount, config)}</td>
            <td>{order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, config) : ''}</td>
            <td>{order.statusForAdmin}</td>
            <td>
                {isOpened ? (
                    <button type='button' onClick={() => setOpenedOrder(null)}>
                        {contentToText(ContentID.buttonClose, config)}
                    </button>
                ) : (
                    <button type='button' onClick={() => setOpenedOrder(order)}>
                        {contentToText(ContentID.buttonOpen, config)}
                    </button>
                )}
            </td>
        </tr>
    );
};

export default AdminOrderRow;

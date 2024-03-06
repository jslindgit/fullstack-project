import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Order } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { getOrderStatusForAdmin } from '../../util/orderProvider';

interface Props {
    handleClose: () => void;
    handleOpen: (order: Order) => Promise<void>;
    isOpened: boolean;
    order: Order;
    stripedClassName: string;
}

const AdminOrderRow = ({ order, isOpened, handleClose, handleOpen, stripedClassName }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const date = new Date(order.createdAt);

    return (
        <tr
            className={
                stripedClassName + ' ' + (isOpened ? 'adminOrdersOpened' : 'buttonHighlight') + (!order.printedOutDate && !order.deliveredDate ? ' bold' : '')
            }
        >
            <td>{format.dateFormat(date)}</td>
            <td>
                {order.customerFirstName} {order.customerLastName}
            </td>
            <td>{format.currency(order.totalAmount, config)}</td>
            <td>{order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, config) : ''}</td>
            <td>{getOrderStatusForAdmin(order, config)}</td>
            <td>
                {isOpened ? (
                    <button type='button' onClick={handleClose}>
                        {contentToText(ContentID.buttonClose, config)}
                    </button>
                ) : (
                    <button type='button' onClick={() => handleOpen(order)}>
                        {contentToText(ContentID.buttonOpen, config)}
                    </button>
                )}
            </td>
        </tr>
    );
};

export default AdminOrderRow;

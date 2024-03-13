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
}

const AdminOrderGridRow = ({ order, isOpened, handleClose, handleOpen }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const date = new Date(order.createdAt);

    return (
        <div
            className={
                'displayContents noWrap ' +
                (isOpened ? 'adminOrdersOpened' : 'buttonHighlight') +
                (!order.printedOutDate && !order.deliveredDate ? ' bold' : '')
            }
        >
            <div>{format.dateFormat(date)}</div>
            <div>
                {order.customerFirstName} {order.customerLastName}
            </div>
            <div>{format.currency(order.totalAmount, config)}</div>
            <div>{order.deliveryMethod ? langTextsToText(order.deliveryMethod.names, config) : ''}</div>
            <div>{getOrderStatusForAdmin(order, config)}</div>
            <div className='alignRight'>
                {isOpened ? (
                    <button type='button' onClick={handleClose}>
                        {contentToText(ContentID.buttonClose, config)}
                    </button>
                ) : (
                    <button type='button' onClick={() => handleOpen(order)}>
                        {contentToText(ContentID.buttonOpen, config)}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminOrderGridRow;

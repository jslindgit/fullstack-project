import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { Order, NewOrder, OrderStatus } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { orderTotalSum } from '../util/checkoutProvider';
import format from '../util/format';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { getOrderStatus } from '../util/orderProvider';

interface Props {
    order: Order | NewOrder;
    showOrderNumber?: boolean;
}

const OrderInfo = ({ order, showOrderNumber = true }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [orderStatus, setOrderStatus] = useState<string>('');

    useEffect(() => {
        const s = getOrderStatus(order.status, config);
        setOrderStatus(s);
    }, [config, order]);

    return (
        <div className={'orderInfo' + (order.status === OrderStatus.PENDING ? ' pending' : '')}>
            <div className='bold marginBottom0_5 sizeVeryLarge'>
                {contentToText(ContentID.checkOutOrderInfo, config) + (showOrderNumber && 'id' in order ? ' #' + order.id : '')}
            </div>
            <div className='lineHeight1_5 paddingLeft1em'>
                {showOrderNumber && 'id' in order && (
                    <>
                        <div className='orderInfoSubHeader'>{contentToText(ContentID.orderId, config)}:</div>
                        <div className='paddingLeft1em'>{order.id}</div>
                    </>
                )}
                {orderStatus.length > 0 && (
                    <>
                        <div className='orderInfoSubHeader marginTop1'>{contentToText(ContentID.orderStatus, config)}:</div>
                        <div className='paddingLeft1em'>{orderStatus}</div>
                    </>
                )}
                <div className='orderInfoSubHeader marginTop1'>{contentToText(ContentID.orderCustomer, config)}:</div>
                <div className='breakWord grid-container paddingLeft1em'>
                    <div>
                        {order.customerFirstName} {order.customerLastName}
                    </div>
                    {order.customerOrganization && <div>{order.customerOrganization}</div>}
                    <div>{order.customerAddress}</div>
                    <div>
                        {order.customerZipCode} {order.customerCity}
                    </div>
                    <div>{order.customerCountry}</div>
                    <div className='breakWord'>{order.customerEmail}</div>
                    <div>{order.customerPhone}</div>
                </div>
                <div className='orderInfoSubHeader marginTop1'>{contentToText(ContentID.orderDeliveryMethod, config)}:</div>
                {order.deliveryMethod && (
                    <div className='paddingLeft1em'>
                        {langTextsToText(order.deliveryMethod.names, config)} <b>({format.currency(order.deliveryCost, config)})</b>
                        {order.deliveryMethod.notes && order.deliveryMethod.notes.length > 0 && (
                            <>
                                <br />({order.deliveryMethod.notes})
                            </>
                        )}
                    </div>
                )}
                {order.paymentMethod && (
                    <>
                        <div className='orderInfoSubHeader marginTop1'>{contentToText(ContentID.orderPaymentMethod, config)}:</div>
                        <div className='capitalize paddingLeft1em'>{order.paymentMethod}</div>
                    </>
                )}
                <div className='orderInfoSubHeader marginTop1'>{contentToText(ContentID.orderItems, config)}:</div>
                <div className='marginTop-0_5'>
                    <ul>
                        {order.items.map((si) => (
                            <li key={si.id.toString() + si.size}>
                                {si.name}
                                {si.size && si.size.length > 0 ? ` [${si.size}]` : ''}&nbsp;&nbsp;({si.quantity} {contentToText(ContentID.itemsPcs, config)}
                                )&nbsp;&nbsp;
                                <span className='bold noWrap'>{format.currency(si.price * si.quantity, config)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='orderInfoSubHeader marginTop1'>{contentToText(ContentID.orderTotalAmount, config)}:</div>
                <div className='bold paddingLeft1em sizeLarge'>{format.currency(orderTotalSum(order), config)}</div>
            </div>
        </div>
    );
};

export default OrderInfo;

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
}

const OrderInfo = ({ order }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [orderStatus, setOrderStatus] = useState<string>('');

    useEffect(() => {
        const s = getOrderStatus(order.status, config);
        setOrderStatus(s);
    }, [config, order]);

    return (
        <div className={'orderInfo' + (order.status === OrderStatus.PENDING ? ' pending' : '')}>
            <div className='bold sizeVeryLarge'>{contentToText(ContentID.checkOutOrderInfo, config) + ('id' in order ? ' #' + order.id : '')}</div>
            <div style={{ lineHeight: 1.5, paddingLeft: '1rem' }}>
                {'id' in order && (
                    <>
                        <div className='adminItemEditLabel'>{contentToText(ContentID.orderId, config)}:</div>
                        <div style={{ paddingLeft: '1rem' }}>{order.id}</div>
                    </>
                )}
                {orderStatus.length > 0 && (
                    <>
                        <div className='adminItemEditLabel' style={{ marginTop: '0.75rem' }}>
                            {contentToText(ContentID.orderStatus, config)}:
                        </div>
                        <div style={{ paddingLeft: '1rem' }}>{orderStatus}</div>
                    </>
                )}
                <div className='adminItemEditLabel' style={{ marginTop: '0.75rem' }}>
                    {contentToText(ContentID.orderCustomer, config)}:
                </div>
                <div className='grid-container' style={{ paddingLeft: '1rem' }}>
                    <div>
                        {order.customerFirstName} {order.customerLastName}
                    </div>
                    {order.customerOrganization && <div>{order.customerOrganization}</div>}
                    <div>{order.customerAddress}</div>
                    <div>
                        {order.customerZipCode} {order.customerCity}
                    </div>
                    <div>{order.customerCountry}</div>
                    <div>{order.customerEmail}</div>
                    <div>{order.customerPhone}</div>
                </div>
                <div className='adminItemEditLabel' style={{ marginTop: '0.75rem' }}>
                    {contentToText(ContentID.orderDeliveryMethod, config)}:
                </div>
                {order.deliveryMethod && (
                    <div style={{ paddingLeft: '1rem' }}>
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
                        <div className='adminItemEditLabel' style={{ marginTop: '0.75rem' }}>
                            {contentToText(ContentID.orderPaymentMethod, config)}:
                        </div>
                        <div className='capitalize' style={{ paddingLeft: '1rem' }}>
                            {order.paymentMethod}
                        </div>
                    </>
                )}
                <div className='adminItemEditLabel' style={{ marginTop: '0.75rem' }}>
                    {contentToText(ContentID.orderItems, config)}:
                </div>
                <div className='sizeSmallish' style={{ marginTop: '-0.5rem' }}>
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
                <div className='adminItemEditLabel' style={{ fontSize: '1rem', marginTop: '0.75rem' }}>
                    {contentToText(ContentID.orderTotalAmount, config)}:
                </div>
                <div className='bold sizeVeryLarge' style={{ paddingLeft: '1rem' }}>
                    {format.currency(orderTotalSum(order), config)}
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;

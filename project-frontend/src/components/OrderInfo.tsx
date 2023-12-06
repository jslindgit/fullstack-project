import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { Order, NewOrder } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { orderTotalSum } from '../util/checkoutProvider';
import format from '../util/format';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { getOrderStatus } from '../types/orderTypeFunctions';

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
        <>
            <table
                align='center'
                width='100%'
                style={{
                    backgroundColor: 'var(--colorGrayExtremelyLight)',
                    border: '0.2em dotted var(--colorGrayLight)',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                }}
            >
                <tbody>
                    <tr>
                        <td>
                            <h3 style={{ marginBottom: 0 }}>{contentToText(ContentID.checkOutOrderInfo, config) + ('id' in order ? ' ' + order.id : '')}</h3>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            <table align='center' width='100%'>
                                <tbody>
                                    {'id' in order ? (
                                        <React.Fragment>
                                            <tr>
                                                <td className='adminItemEditLabel'>{contentToText(ContentID.orderId, config)}:</td>
                                            </tr>
                                            <tr>
                                                <td>{order.id}</td>
                                            </tr>
                                        </React.Fragment>
                                    ) : (
                                        ''
                                    )}
                                    {orderStatus.length > 0 ? (
                                        <React.Fragment>
                                            <tr>
                                                <td className='adminItemEditLabel'>{contentToText(ContentID.orderStatus, config)}:</td>
                                            </tr>
                                            <tr>
                                                <td>{orderStatus}</td>
                                            </tr>
                                        </React.Fragment>
                                    ) : (
                                        ''
                                    )}
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.orderCustomer, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table align='center' width='100%' className='noPadding'>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            {order.customerFirstName} {order.customerLastName}
                                                        </td>
                                                    </tr>
                                                    {order.customerOrganization ? (
                                                        <tr>
                                                            <td>{order.customerOrganization}</td>
                                                        </tr>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <tr>
                                                        <td>{order.customerAddress}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {order.customerZipCode} {order.customerCity}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>{order.customerCountry}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{order.customerEmail}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{order.customerPhone}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.orderDeliveryMethod, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {order.deliveryMethod ? (
                                                <>
                                                    {langTextsToText(order.deliveryMethod.names, config)} <b>({format.currency(order.deliveryCost, config)})</b>
                                                    {order.deliveryMethod.notes && order.deliveryMethod.notes.length > 0 ? (
                                                        <>
                                                            <br />
                                                            <br />
                                                            {order.deliveryMethod.notes}
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            ) : (
                                                <>-</>
                                            )}
                                        </td>
                                    </tr>
                                    {order.paymentMethod ? (
                                        <tr>
                                            <td className='adminItemEditLabel'>{contentToText(ContentID.orderPaymentMethod, config)}:</td>
                                        </tr>
                                    ) : (
                                        ''
                                    )}
                                    {order.paymentMethod ? (
                                        <tr>
                                            <td className='capitalize'>{order.paymentMethod}</td>
                                        </tr>
                                    ) : (
                                        ''
                                    )}
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.orderItems, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {order.items.map((si) => (
                                                <div key={si.id}>
                                                    {si.name} &nbsp; ({si.quantity} pcs) &nbsp; <b>{format.currency(si.price * si.quantity, config)}</b>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel' style={{ fontSize: '1rem' }}>
                                            {contentToText(ContentID.orderTotalAmount, config)}:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h4>{format.currency(orderTotalSum(order), config)}</h4>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default OrderInfo;

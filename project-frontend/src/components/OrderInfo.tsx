import { useSelector } from 'react-redux';

import { Order, NewOrder } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { langTextsToText } from '../types/languageFunctions';
import { orderTotalSum } from '../util/checkoutProvider';

interface Props {
    order: Order | NewOrder;
}

const OrderInfo = ({ order }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    return (
        <>
            <table align='center' width='100%' style={{ backgroundColor: 'var(--colorGrayExtremelyLight)', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <tbody>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            <h3 style={{ marginBottom: 0 }}>Order Info</h3>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            <table align='center' width='100%'>
                                <tbody>
                                    {'id' in order ? (
                                        <tr>
                                            <td className='adminItemEditLabel'>Order ID:</td>
                                        </tr>
                                    ) : (
                                        ''
                                    )}
                                    {'id' in order ? (
                                        <tr>
                                            <td>{order.id}</td>
                                        </tr>
                                    ) : (
                                        ''
                                    )}
                                    <tr>
                                        <td className='adminItemEditLabel'>Status:</td>
                                    </tr>
                                    <tr>
                                        <td>{order.status}</td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel'>Customer:</td>
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
                                        <td className='adminItemEditLabel'>Delivery Method:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {order.deliveryMethod ? (
                                                <>
                                                    {langTextsToText(order.deliveryMethod.names, configState)} <b>({format.currency(order.deliveryCost, configState)})</b>
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
                                            <td className='adminItemEditLabel'>Payment Method:</td>
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
                                        <td className='adminItemEditLabel'>Items:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {order.items.map((si) => (
                                                <div key={si.id}>
                                                    {si.name} &nbsp; ({si.quantity} pcs) &nbsp; <b>{format.currency(si.price * si.quantity, configState)}</b>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel' style={{ fontSize: '1rem' }}>
                                            Total Amount:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h4>{format.currency(orderTotalSum(order), configState)}</h4>
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
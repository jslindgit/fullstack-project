import { useSelector } from 'react-redux';

import { Order, NewOrder } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { itemsTotalSum } from '../util/checkoutProvider';

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
                                            {order.customer ? (
                                                <table align='center' width='100%' className='noPadding'>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                {order.customer.firstname} {order.customer.lastname}
                                                            </td>
                                                        </tr>
                                                        {order.customer.organization ? (
                                                            <tr>
                                                                <td>{order.customer.organization}</td>
                                                            </tr>
                                                        ) : (
                                                            ''
                                                        )}
                                                        <tr>
                                                            <td>{order.customer.address}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                {order.customer.zipcode} {order.customer.city}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>{order.customer.country}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{order.customer.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{order.customer.phone}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <>-</>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel'>Delivery Method:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {order.deliveryMethod ? (
                                                <>
                                                    {order.deliveryMethod.name} <b>({format.currency(order.deliveryMethod.cost, configState)})</b>
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
                                            <td>{order.paymentMethod ? <>{order.paymentMethod.name}</> : <>-</>}</td>
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
                                                <div key={si.itemId}>
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
                                            <h4>{format.currency(itemsTotalSum(order.items) + (order.deliveryMethod ? order.deliveryMethod.cost : 0), configState)}</h4>
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

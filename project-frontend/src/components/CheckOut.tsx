import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ItemPair } from './ShoppinCart';
import { Contact, DeliveryMethod, NewOrder, Order, OrderStatus } from '../types/orderTypes';

import { fetchItems } from '../util/checkoutProvider';
import orderHandler from '../util/orderHandler';
import { pageWidth } from '../constants';
import { validateOrder } from '../types/orderTypeFunctions';

import BackButton from './BackButton';
import CheckOutContactInfo from './CheckOutContactInfo';
import CheckOutDelivery from './CheckOutDelivery';
import OrderInfo from './OrderInfo';

const CheckOut = () => {
    const fetchOrder = (): Order | NewOrder => {
        const storedOrder = orderHandler.getOrder();
        if (storedOrder) {
            return storedOrder;
        }
        return { customer: null, recipient: null, items: [], deliveryMethod: null, paymentMethod: null, status: OrderStatus.PENDING };
    };

    const [items, setItems] = useState<ItemPair[]>([]);
    const [order, setOrder] = useState<NewOrder | Order>(fetchOrder());
    const [validate, setValidate] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    const fetch = async () => {
        setItems(await fetchItems());
    };

    const handlePaymentClick = () => {
        setValidate(true);

        setValidationErrors(validateOrder(order));

        if (validationErrors.length <= 0) {
            navigate('/payment');
        }
    };

    const setCustomerInfo = (info: Contact) => {
        setOrder({ ...order, customer: info });
    };

    const setDeliveryMethod = (deliveryMethod: DeliveryMethod | null) => {
        setOrder({ ...order, deliveryMethod: deliveryMethod });
    };

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        setOrder({ ...order, items: items.map((item) => item.shoppingItem) });
    }, [items]);

    useEffect(() => {
        orderHandler.setOrder(order);
    }, [order]);

    useEffect(() => {
        if (validate) {
            setValidationErrors(validateOrder(order));
        }
    }, [order, validate]);

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Check out</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            <CheckOutDelivery currentMethod={order.deliveryMethod} setDeliveryMethod={setDeliveryMethod} validate={validate} width='100%' />
                            <CheckOutContactInfo currentInfo={order.customer} setCustomerInfo={setCustomerInfo} validate={validate} width='100%' />
                        </td>
                        <td width='3rem'></td>
                        <td width='40%' style={{ verticalAlign: 'top', paddingTop: 0 }}>
                            <div style={{ position: 'sticky', top: '1rem' }}>
                                <OrderInfo order={order} />
                                {validationErrors.length > 0 ? (
                                    <table align='center' width='100%' className='notification notificationNegative' style={{ borderRadius: '0.5rem', marginTop: '1rem' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ fontWeight: '500' }}>
                                                    Please check the following:
                                                    <div style={{ paddingTop: '1rem', paddingBottom: '0', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                                        {validationErrors.map((e) => (
                                                            <div key={e} style={{ fontStyle: 'italic', lineHeight: '2rem', fontWeight: '500' }}>
                                                                • {e}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    ''
                                )}
                                <button type='button' className='large' onClick={handlePaymentClick} disabled={validationErrors.length > 0} style={{ width: '100%', marginTop: '1rem' }}>
                                    Choose payment method →
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='text' to='/cart' />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOut;

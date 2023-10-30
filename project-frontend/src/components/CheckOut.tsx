import { useCallback, useEffect, useState } from 'react';

import { ItemPair } from './ShoppinCart';
import { Contact, DeliveryMethod, NewOrder, Order, OrderStatus } from '../types/orderTypes';

import { fetchItems } from '../util/checkoutProvider';
import orderHandler from '../util/orderHandler';
import { pageWidth } from '../constants';
import { validateOrder } from '../types/orderTypeFunctions';

import BackButton from './BackButton';
import CheckOutContactInfo from './CheckOutContactInfo';
import CheckOutDelivery from './CheckOutDelivery';
import { Link } from './CustomLink';
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

    const fetch = async () => {
        setItems(await fetchItems());
    };

    const handlePaymentClick = () => {
        setValidate(true);

        const errors = validateOrder(order);

        if (errors.length <= 0) {
            console.log('TODO: Proceed to payment...'); // TODO
            setValidationErrors([]);
        } else {
            setValidationErrors(errors.map((e) => e.toString()));
        }
    };

    const setCustomerInfo = useCallback((info: Contact) => {
        setOrder({ ...order, customer: info });
    }, []);

    const setDeliveryMethod = (deliveryMethod: DeliveryMethod) => {
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
                        <td width='55%' style={{ paddingTop: 0 }}>
                            <CheckOutDelivery currentMethod={order.deliveryMethod} setDeliveryMethod={setDeliveryMethod} width='100%' />
                            <CheckOutContactInfo currentInfo={order.customer} setCustomerInfo={setCustomerInfo} validate={validate} width='100%' />
                        </td>
                        <td width='3rem'></td>
                        <td style={{ verticalAlign: 'top', paddingTop: 0 }}>
                            <OrderInfo order={order} validationErrors={validationErrors} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='text' />
                        </td>
                        <td className='sizeVeryLarge' style={{ textAlign: 'right' }} onClick={handlePaymentClick}>
                            <Link to='#'>Payment →</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOut;

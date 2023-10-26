import { useCallback, useEffect, useState } from 'react';

import { ItemPair } from './ShoppinCart';
import { Contact, DeliveryMethod, NewOrder, Order, OrderStatus } from '../types/orderTypes';

import { fetchItems } from '../util/checkoutProvider';
import orderHandler from '../util/orderHandler';
import { pageWidth } from '../constants';

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

    const fetch = async () => {
        setItems(await fetchItems());
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
                        <td width='55%'>
                            <CheckOutDelivery currentMethod={order.deliveryMethod} setDeliveryMethod={setDeliveryMethod} width='100%' />
                            <CheckOutContactInfo currentInfo={order.customer} setCustomerInfo={setCustomerInfo} width='100%' />
                        </td>
                        <td width='3rem'></td>
                        <td style={{ verticalAlign: 'top' }}>
                            <OrderInfo order={order} />
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
                        <td className='sizeVeryLarge' style={{ textAlign: 'right' }}>
                            <Link to='/checkout'>Payment →</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOut;

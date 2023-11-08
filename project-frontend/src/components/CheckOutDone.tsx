/* https://tempurlfullstack.com/success
?checkout-account=375917
&checkout-algorithm=sha256
&checkout-amount=10900
&checkout-stamp=0370de79-12c1-44b1-96b0-8d3956b7e5ed
&checkout-reference=3
&checkout-status=ok
&checkout-provider=nordea
&checkout-transaction-id=b329c092-7dbc-11ee-a9ea-33ade29af196
&signature=af7796712d74488a5f593e91c931a9c1cb321ecb8f2c15e68555ac6c3d99f568
*/
import { useSearchParams } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { Order, OrderStatus } from '../types/orderTypes';

import { pageWidth } from '../constants';
//import orderHandler from '../util/orderHandler';
import orderService from '../services/orderService';

import BackButton from './BackButton';
import OrderInfo from './OrderInfo';

const CheckOutDone = () => {
    const [order, setOrder] = useState<Order | null>(null);

    const [searchparams] = useSearchParams();

    useEffect(() => {
        const fetchOrderFromServer = async () => {
            const orderId = searchparams.get('checkout-reference');
            const orderResponse = orderId ? await orderService.getById(Number(orderId)) : null;
            if (orderResponse && orderResponse.success && orderResponse.order) {
                setOrder(orderResponse.order);
                //orderHandler.setOrder(null);
            } else {
                setOrder(null);
            }
        };

        fetchOrderFromServer();
    }, [searchparams]);

    useEffect(() => {
        if (order && order.status === OrderStatus.PENDING) {
            const updateOrderStatus = async () => {
                const paymentMethod = searchparams.get('checkout-provider') as string;
                const orderResponse = await orderService.update(order.id, { paymentMethod: paymentMethod, status: OrderStatus.PROCESSING });
                if (orderResponse.success && orderResponse.order) {
                    setOrder(orderResponse.order);
                }
            };

            updateOrderStatus();
        }
    });

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Check Out</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            <table align='center' width='100%' className='paddingTopBottomOnly'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <h2>Thank you!</h2>
                                            Your order has been received and is being processed for delivery.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <br />
                                            <br />
                                            <BackButton label='Back to shop' type='text' to='/' />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='3rem'></td>
                        <td width='40%' style={{ verticalAlign: 'top', paddingTop: 0 }}>
                            <div style={{ position: 'sticky', top: '1rem' }}>{order ? <OrderInfo order={order} /> : <></>}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOutDone;

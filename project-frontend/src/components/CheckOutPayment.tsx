import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NewOrder, Order } from '../types/orderTypes';

import orderHandler from '../util/orderHandler';
import { pageWidth } from '../constants';
import { validateOrder } from '../types/orderTypeFunctions';

import BackButton from './BackButton';
import OrderInfo from './OrderInfo';

const CheckOutPayment = () => {
    const [order, setOrder] = useState<NewOrder | Order | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedOrder = orderHandler.getOrder();
        if (storedOrder && validateOrder(storedOrder).length <= 0) {
            return setOrder(storedOrder);
        } else {
            navigate('/checkout');
        }
    }, [navigate]);

    if (!order) {
        return (
            <div>
                <br />
                Order not found.
            </div>
        );
    }

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
                        <td width='55%' style={{ paddingTop: 0, verticalAlign: 'top' }}>
                            <table align='center' width='100%' className='paddingTopBottomOnly'>
                                <tbody>
                                    <tr>
                                        <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <h3>Choose Payment Method</h3>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='3rem'></td>
                        <td style={{ verticalAlign: 'top', paddingTop: 0 }}>
                            <div style={{ position: 'sticky', top: '1rem' }}>
                                <OrderInfo order={order} />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='text' to='/checkout' />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOutPayment;

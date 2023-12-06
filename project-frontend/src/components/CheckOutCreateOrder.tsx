import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { isOrder, validateOrder } from '../types/orderTypeFunctions';
import orderService from '../services/orderService';

import { setOrder } from '../reducers/orderReducer';

import { contentToText } from '../types/languageFunctions';

const CheckOutCreateOrder = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    const attemptedToCreateOrder = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!orderState || validateOrder(orderState, config).length > 0) {
            navigate('/checkout');
        }
    }, [config, navigate, orderState]);

    useEffect(() => {
        // If 'order' is still NewOrder, make an api call to convert it into an Order and to save it in the database:
        if (!isOrder(orderState) && validateOrder(orderState, config).length <= 0 && !attemptedToCreateOrder.current) {
            console.log('createOrder...');
            const createdOrder = async () => {
                const response = await orderService.addNew(orderState, config);
                if (response.success && response.order) {
                    dispatch(setOrder(response.order));
                }
            };

            const executeCreateOrder = async () => {
                const promise = createdOrder();
                Promise.all([promise]);
            };

            executeCreateOrder();

            attemptedToCreateOrder.current = true;
        }
    }, [config, dispatch, orderState]);

    useEffect(() => {
        if (orderState) {
            navigate('/payment');
        }
    }, [navigate, orderState]);

    if (attemptedToCreateOrder.current === false) {
        return (
            <>
                <br />
                <div className='sizeLarge semiBold'>{contentToText(ContentID.miscLoading, config)}</div>
            </>
        );
    }

    return (
        <>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Check out</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td className='sizeLarge semiBold'>
                            {isOrder(orderState) ? <>Ok</> : <>{contentToText(ContentID.errorSomethingWentWrong, config)}.</>}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default CheckOutCreateOrder;

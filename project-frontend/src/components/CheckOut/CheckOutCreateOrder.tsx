import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../../content';
import { NewOrder } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import { validateOrder } from '../../util/orderProvider';
import { isOrder, isOrderOrNewOrder } from '../../types/orderTypeFunctions';
import orderService from '../../services/orderService';

import { OrderState, setOrder } from '../../reducers/orderReducer';

import { contentToText } from '../../types/languageFunctions';
import { handleError } from '../../util/handleError';

import Loading from '../Loading';

const CheckOutCreateOrder = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);
    const userState = useSelector((state: RootState) => state.user);

    const [currentOrder, setCurrentOrder] = useState<OrderState | null>(null);
    const [error, setError] = useState<boolean>(false);

    const navigate = useNavigate();

    // If there's no valid Order/NewOrder in Redux state, go back to CheckOut:
    useEffect(() => {
        if (!orderState || !isOrderOrNewOrder(orderState) || validateOrder(orderState, config).length > 0) {
            navigate('/checkout');
        }
    }, [config, navigate, orderState]);

    // If 'currentOrder' hasn't been set yet, set it as the Order/NewOrder in Redux state:
    useEffect(() => {
        if (currentOrder === null) {
            const newOrder: NewOrder = { ...orderState };
            if ('id' in newOrder) {
                delete newOrder.id;
            }
            setCurrentOrder(newOrder);
        }
    }, [currentOrder, orderState]);

    // If 'currentOrder' is a NewOrder, post it to the server and set the response (an Order) as the value of both 'currentOrder' and Redux state:
    useEffect(() => {
        if (currentOrder !== null && !isOrder(currentOrder)) {
            orderService
                .addNew(currentOrder, config, userState.loggedUser ? userState.loggedUser.id : null)
                .then((res) => {
                    if (res.success && res.order) {
                        dispatch(setOrder(res.order));
                        setCurrentOrder(res.order);
                    } else {
                        setError(true);
                    }
                })
                .catch((err: unknown) => {
                    console.error(err);
                    setError(true);
                    handleError(err);
                });
        }
    }, [config, currentOrder, dispatch, userState.loggedUser]);

    // If the order has been successfully posted to the server, navigate onwards to payment method selection:
    useEffect(() => {
        if (isOrder(currentOrder) && isOrder(orderState) && currentOrder.id === orderState.id) {
            navigate('/payment');
        }
    }, [currentOrder, navigate, orderState]);

    return (
        <>
            <div className='alignCenter marginTop2 pageWidth sizeLarge'>
                {error ? (
                    <>{contentToText(ContentID.errorSomethingWentWrong, config)}</>
                ) : isOrder(currentOrder) ? (
                    <>
                        <a href='/payment'>{contentToText(ContentID.checkOutChoosePaymentMethod, config)}</a>
                    </>
                ) : (
                    <Loading config={config} />
                )}
            </div>
        </>
    );
};

export default CheckOutCreateOrder;

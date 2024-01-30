import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { isOrder, orderToRequestBody, validateOrder } from '../types/orderTypeFunctions';
import orderService from '../services/orderService';

import { setOrder } from '../reducers/orderReducer';

import { contentToText } from '../types/languageFunctions';

const CheckOutCreateOrder = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);
    const userState = useSelector((state: RootState) => state.user);

    const attemptedToCreateOrder = useRef(false);

    const navigate = useNavigate();

    // If there's no valid order in Redux state, go back to CheckOut:
    useEffect(() => {
        if (!orderState || validateOrder(orderState, config).length > 0) {
            navigate('/checkout');
        }
    }, [config, navigate, orderState]);

    // If the order in Redux state is still NewOrder, make a call to the server to convert it into an Order and to save it in the database-
    // If it's already an Order (has been posted to the server earlier), update it (in case it has been modified since).
    useEffect(() => {
        if (!isOrder(orderState) && validateOrder(orderState, config).length <= 0 && !attemptedToCreateOrder.current) {
            const createdOrder = async () => {
                const response = await orderService.addNew(orderState, config, userState.loggedUser ? userState.loggedUser.id : null);
                if (response.success && response.order) {
                    dispatch(setOrder(response.order));
                }
            };

            const executeCreateOrder = async () => {
                Promise.all([createdOrder()]);
            };

            executeCreateOrder();

            attemptedToCreateOrder.current = true;
        } else if (isOrder(orderState)) {
            const updateOrder = async () => {
                const toUpdate = orderToRequestBody(orderState, config, false, userState.loggedUser ? userState.loggedUser.id : null);
                await orderService.update(orderState.id, toUpdate);
            };

            updateOrder();
        }
    }, [config, dispatch, orderState, userState.loggedUser]);

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
            <div className='pageWidth'>{isOrder(orderState) ? <>Ok</> : <>{contentToText(ContentID.errorSomethingWentWrong, config)}.</>}</div>
        </>
    );
};

export default CheckOutCreateOrder;

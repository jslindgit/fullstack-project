import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { OrderResponse } from '../../services/orderService';
import { OrderStatus } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import itemService from '../../services/itemService';
import { contentToText } from '../../types/languageFunctions';
import orderService from '../../services/orderService';
import paytrailService from '../../services/paytrailService';

import { clearOrder } from '../../reducers/orderReducer';

import BackButton from '../BackButton';
import { Link } from '../CustomLink';
import OrderInfo from '../OrderInfo';
import { isOrder } from '../../types/orderTypeFunctions';

enum SignatureStatus {
    INVALID,
    PENDING,
    VALID,
}

const CheckOutDone = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    const attemptedToFetchOrder = useRef(false);
    const clearedOrderFromRedux = useRef(false);

    const [errorWhenFetchingOrder, setErrorWhenFetchingOrder] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);
    const [signatureStatus, setSignatureStatus] = useState<SignatureStatus>(SignatureStatus.PENDING);

    const [searchparams] = useSearchParams();

    // Get 'orderId' from the return URL:
    useEffect(() => {
        const checkoutReference = searchparams.get('checkout-reference');
        if (checkoutReference) {
            setOrderId(checkoutReference);
        }
    }, [searchparams]);

    // When 'orderId' is set, get the order from the server:
    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                const response = await orderService.getById(Number(orderId));
                setOrderResponse(response);
                attemptedToFetchOrder.current = true;
            };
            fetchOrder();
        }
    }, [orderId]);

    // When 'orderResponse' is set, check that it matches the order in Redux. If yes, remove the order from Redux. If no, set 'errorWhenFetchingOrder' to true:
    useEffect(() => {
        if (orderResponse) {
            if (orderResponse.success === false || (clearedOrderFromRedux.current === false && !orderResponse.order)) {
                setErrorWhenFetchingOrder(true);
            } else if (isOrder(orderState) && orderResponse.order && orderState.id !== orderResponse.order.id) {
                setErrorWhenFetchingOrder(true);
            } else if (clearedOrderFromRedux.current === false) {
                clearOrder(dispatch);
                clearedOrderFromRedux.current = true;
            }
        }
    }, [dispatch, orderResponse, orderState]);

    // When 'orderResponse' is set, check that the returned 'signature' is valid:
    useEffect(() => {
        if (errorWhenFetchingOrder === false && orderResponse?.order && signatureStatus === SignatureStatus.PENDING) {
            const isValidSignature = async () => {
                const res = await paytrailService.validateSignatureFromUrl(window.location.href);
                setSignatureStatus(res.success ? SignatureStatus.VALID : SignatureStatus.INVALID);
            };
            isValidSignature();
        }
    }, [errorWhenFetchingOrder, orderResponse, signatureStatus]);

    // If the 'signature' is valid, update the Order's 'status' (from "PENDING" to "PROCESSING") and 'paymentMethod'.
    // Also update the 'instock' and 'sold' attributes of all the Items that were in this Order:
    useEffect(() => {
        if (errorWhenFetchingOrder === false && orderResponse?.order?.status === OrderStatus.PENDING && signatureStatus === SignatureStatus.VALID) {
            const updateOrderStatus = async () => {
                if (orderResponse.order) {
                    const paymentMethod = searchparams.get('checkout-provider') as string;
                    const response = await orderService.update(orderResponse.order.id, { paymentMethod: paymentMethod, status: OrderStatus.PROCESSING });
                    setOrderResponse(response);
                }
            };

            updateOrderStatus();

            const updateSoldValues = async () => {
                if (orderResponse.order) {
                    await itemService.updateInstockAndSoldValues(orderResponse.order);
                }
            };

            updateSoldValues();
        }
    }, [errorWhenFetchingOrder, orderResponse, searchparams, signatureStatus]);

    const signaturePendingOrInvalid = (): JSX.Element => {
        if (signatureStatus === SignatureStatus.INVALID || errorWhenFetchingOrder) {
            return (
                <>
                    {contentToText(errorWhenFetchingOrder ? ContentID.checkOutErrorWhenFetchingOrder : ContentID.checkOutErrorSignatureMismatch, config)}
                    &nbsp;
                    <Link to='/info'>{contentToText(ContentID.menuInfo, config)}</Link>
                </>
            );
        } else {
            return <div className='semiBold sizeLarge'>{contentToText(ContentID.miscLoading, config)}</div>;
        }
    };

    return (
        <div className='pageWidth'>
            <div className='pageHeader'>{contentToText(ContentID.checkOutHeader, config)}</div>
            <div className='grid-container' data-gap='4rem' style={{ gridTemplateColumns: '1fr 39%' }}>
                <div className='alignLeft grid-container' data-gap='3rem' style={{ height: 'min-content' }}>
                    {signatureStatus === SignatureStatus.VALID ? (
                        <React.Fragment>
                            <div className='bold sizeExtremelyLarge'>{contentToText(ContentID.checkOutThankYou, config)}</div>
                            <div className='preLine'>
                                {contentToText(ContentID.checkOutYourOrderHasBeenReceive, config)} {config.store.deliveryTimeBusinessDays}{' '}
                                {contentToText(ContentID.miscDays, config)}.
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>{signaturePendingOrInvalid()}</React.Fragment>
                    )}
                    <div>
                        <BackButton labelContentID={ContentID.checkOutBackToShop} type='text' to='/' />
                    </div>
                </div>
                <div>
                    {orderResponse?.order && <OrderInfo order={orderResponse.order} />}
                    <br />
                </div>
            </div>
        </div>
    );
};

export default CheckOutDone;

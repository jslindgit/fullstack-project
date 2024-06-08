import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { OrderResponse, OrderStatus } from '../../types/orderTypes';
import { RootState } from '../../redux/rootReducer';

import { updateInstockAndSoldValues } from '../../services/itemService';
import { contentToText } from '../../types/languageFunctions';
import { isOrder } from '../../types/orderTypeFunctions';
import paytrailService from '../../services/paytrailService';

import { clearOrder } from '../../redux/orderReducer';
import { useOrderGetByIdQuery, useOrderUpdateMutation } from '../../redux/orderSlice';
import store from '../../redux/store';

import BackButton from '../BackButton';
import { Link } from '../CustomLink';
import Loading from '../Loading';
import LoadingQuery from '../LoadingQuery';
import OrderInfo from '../OrderInfo';
import { isNumber } from '../../types/typeFunctions';

enum SignatureStatus {
    INVALID,
    PENDING,
    VALID,
}

const CheckOutDone = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    const clearedOrderFromRedux = useRef(false);

    const [errorWhenFetchingOrder, setErrorWhenFetchingOrder] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);
    const [signatureStatus, setSignatureStatus] = useState<SignatureStatus>(SignatureStatus.PENDING);

    const [searchparams] = useSearchParams();

    const orderGetById = useOrderGetByIdQuery({ id: Number(orderId) }, { skip: !isNumber(Number(orderId)) || Number(orderId) <= 0 });
    const [orderUpdate] = useOrderUpdateMutation();

    // Get 'orderId' from the return URL:
    useEffect(() => {
        const checkoutReference = searchparams.get('checkout-reference');
        if (checkoutReference) {
            setOrderId(checkoutReference);
        }
    }, [searchparams]);

    // When 'orderId' is set, check if 'orderGetById' managed to fetch the order from the server:
    useEffect(() => {
        if (orderGetById.data) {
            setOrderResponse(orderGetById.data);
        }
    }, [orderGetById.data]);

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

                    const res = await orderUpdate({
                        orderId: orderResponse.order.id,
                        propsToUpdate: { paymentMethod: paymentMethod, status: OrderStatus.PROCESSING },
                        config: config,
                    }).unwrap();

                    setOrderResponse(res);
                }
            };

            updateOrderStatus();

            const updateSoldValues = async () => {
                if (orderResponse.order) {
                    await updateInstockAndSoldValues(orderResponse.order, store.dispatch);
                }
            };

            updateSoldValues();
        }
    }, [config, errorWhenFetchingOrder, orderResponse, orderUpdate, searchparams, signatureStatus]);

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
            return <Loading config={config} />;
        }
    };

    if (!orderGetById.data) {
        return <LoadingQuery query={orderGetById} config={config} />;
    }

    return (
        <div className='pageWidth'>
            <div className='pageHeader'>{contentToText(ContentID.checkOutHeader, config)}</div>
            <div className='grid-container' data-cols='check-out' data-gap='4rem'>
                <div className='alignLeft divMinHeight grid-container height' data-gap='3rem'>
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

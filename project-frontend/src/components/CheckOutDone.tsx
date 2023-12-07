import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContentID } from '../content';
import { OrderResponse } from '../services/orderService';
import { OrderStatus } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';
import orderService from '../services/orderService';
import paytrailService from '../services/paytrailService';

import { clearOrder } from '../reducers/orderReducer';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import OrderInfo from './OrderInfo';

enum SignatureStatus {
    INVALID,
    PENDING,
    VALID,
}

const CheckOutDone = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);

    const attemptedToFetchOrder = useRef(false);
    const clearedOrderFromRedux = useRef(false);

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
                console.log('response (fetching):', response);
                setOrderResponse(response);
                attemptedToFetchOrder.current = true;
            };
            fetchOrder();
        }
    }, [orderId]);

    // When 'orderResponse' is set, remove the order from Redux state:
    useEffect(() => {
        if (orderResponse && clearedOrderFromRedux.current === false) {
            clearOrder(dispatch);
            clearedOrderFromRedux.current = true;
        }
    }, [dispatch, orderResponse]);

    // When 'orderResponse' is set, check that the returned 'signature' is valid:
    useEffect(() => {
        console.log('When orderResponse is set, check that the returned signature is valid');
        if (orderResponse?.order && signatureStatus === SignatureStatus.PENDING) {
            console.log('if (orderResponse?.order && signatureStatus.current === SignatureStatus.PENDING) {');
            const isValidSignature = async () => {
                const res = await paytrailService.validateSignatureFromUrl(window.location.href);
                console.log('res (paytrailService.validateSignatureFromUrl):', res);
                setSignatureStatus(res.success ? SignatureStatus.VALID : SignatureStatus.INVALID);
            };
            isValidSignature();
        }
    }, [orderResponse, signatureStatus]);

    // If the 'signature' is valid, update the order's status from "PENDING" to "PROCESSING":
    useEffect(() => {
        console.log('If the signature is valid, update the orders status from "PENDING" to "PROCESSING":');
        if (orderResponse?.order?.status === OrderStatus.PENDING && signatureStatus === SignatureStatus.VALID) {
            const updateOrderStatus = async () => {
                if (orderResponse.order) {
                    const paymentMethod = searchparams.get('checkout-provider') as string;
                    const response = await orderService.update(orderResponse.order.id, { paymentMethod: paymentMethod, status: OrderStatus.PROCESSING });
                    console.log('response (updating status):', orderResponse);
                    setOrderResponse(response);
                }
            };

            updateOrderStatus();
        }
    }, [orderResponse, searchparams, signatureStatus]);

    const signaturePendingOrInvalid = (): JSX.Element => {
        if (signatureStatus === SignatureStatus.INVALID) {
            return (
                <>
                    {contentToText(ContentID.checkOutSignatureMismatch, config)}
                    &nbsp;
                    <Link to='/info'>{contentToText(ContentID.menuInfo, config)}</Link>
                </>
            );
        } else {
            return <div className='semiBold sizeLarge'>{contentToText(ContentID.miscLoading, config)}</div>;
        }
    };

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.checkOutHeader, config)}</td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth} className='valignTop'>
                <tbody>
                    <tr>
                        <td style={{ paddingLeft: 0, paddingTop: 0 }}>
                            <table align='center' width='100%' className='paddingTopBottomOnly'>
                                <tbody>
                                    <tr>
                                        <td style={{ paddingTop: 0 }}>
                                            {signatureStatus === SignatureStatus.VALID ? (
                                                <>
                                                    <h2>{contentToText(ContentID.checkOutThankYou, config)}</h2>
                                                    {contentToText(ContentID.checkOutYourOrderHasBeenReceive, config)} {config.store.deliveryTimeBusinessDays}{' '}
                                                    {contentToText(ContentID.miscDays, config)}.
                                                </>
                                            ) : (
                                                <>{signaturePendingOrInvalid()}</>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <br />
                                            <br />
                                            <BackButton labelContentID={ContentID.checkOutBackToShop} type='text' to='/' />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='3rem'></td>
                        <td width='40%' style={{ verticalAlign: 'top', paddingTop: 0 }}>
                            <div style={{ position: 'sticky', top: '1rem' }}>{orderResponse?.order ? <OrderInfo order={orderResponse.order} /> : <></>}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOutDone;

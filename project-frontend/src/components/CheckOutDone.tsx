import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ContentID } from '../content';
import { Order, OrderStatus } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';
//import orderHandler from '../util/orderHandler';
import orderService from '../services/orderService';
import paytrailService from '../services/paytrailService';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import OrderInfo from './OrderInfo';

enum SignatureStatus {
    INVALID,
    PENDING,
    VALID,
}

const CheckOutDone = () => {
    const config = useSelector((state: RootState) => state.config);

    const [order, setOrder] = useState<Order | null>(null);
    const [signatureStatus, setSignatureStatus] = useState<SignatureStatus>(SignatureStatus.PENDING);

    const [searchparams] = useSearchParams();

    useEffect(() => {
        const fetchOrderFromServer = async () => {
            const orderId = searchparams.get('checkout-reference');

            let fetchedOrder: Order | null = null;
            if (orderId) {
                const fetchOrder = async () => {
                    fetchedOrder = (await orderService.getById(Number(orderId))).order;
                };
                const fetchPromise = fetchOrder();
                await Promise.resolve(fetchPromise);
            }

            setOrder(fetchedOrder);
        };

        fetchOrderFromServer();
    }, [searchparams]);

    useEffect(() => {
        if (order && signatureStatus === SignatureStatus.PENDING) {
            // Check that the returned 'signature' is valid:
            const isValidSignature = async () => {
                const res = await paytrailService.validateSignatureFromUrl(window.location.href);
                setSignatureStatus(res.success ? SignatureStatus.VALID : SignatureStatus.INVALID);
            };
            isValidSignature();
        }
    }, [order]);

    useEffect(() => {
        if (order && order.status === OrderStatus.PENDING) {
            if (signatureStatus === SignatureStatus.VALID) {
                const updateOrderStatus = async () => {
                    const paymentMethod = searchparams.get('checkout-provider') as string;
                    const orderResponse = await orderService.update(order.id, { paymentMethod: paymentMethod, status: OrderStatus.PROCESSING });
                    if (orderResponse.success && orderResponse.order) {
                        setOrder(orderResponse.order);
                    }
                };

                updateOrderStatus();
            } else {
                // TODO: signature mismatch - do something?
            }
        }
    }, [order, searchparams, signatureStatus]);

    const signatureNotValid = (): JSX.Element => {
        if (signatureStatus === SignatureStatus.INVALID) {
            return (
                <>
                    {contentToText(ContentID.checkOutSignatureMismatch, config)}
                    &nbsp;
                    <Link to='/info'>{contentToText(ContentID.menuInfo, config)}</Link>
                </>
            );
        } else {
            return <>{contentToText(ContentID.miscLoading, config)}</>;
        }
    };

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
            <table align='center' width={pageWidth} className='valignTop'>
                <tbody>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            <table align='center' width='100%' className='paddingTopBottomOnly'>
                                <tbody>
                                    <tr>
                                        <td>
                                            {signatureStatus === SignatureStatus.VALID ? (
                                                <>
                                                    <h2>{contentToText(ContentID.checkOutThankYou, config)}</h2>
                                                    {contentToText(ContentID.checkOutYourOrderHasBeenReceive, config)}
                                                </>
                                            ) : (
                                                <>{signatureNotValid()}</>
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
                            <div style={{ position: 'sticky', top: '1rem' }}>{order ? <OrderInfo order={order} /> : <></>}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOutDone;

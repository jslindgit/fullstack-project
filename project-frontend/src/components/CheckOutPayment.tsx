import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../reducers/rootReducer';
import { NewOrder, Order, PaytrailData, PaytrailProvider } from '../types/orderTypes';

import format from '../util/format';

import orderHandler from '../util/orderHandler';
import { orderTotalSum } from '../util/checkoutProvider';
import { pageWidth } from '../constants';
import paytrailService from '../services/paytrailService';
import { validateOrder } from '../types/orderTypeFunctions';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import OrderInfo from './OrderInfo';

const CheckOutPayment = () => {
    const configState = useSelector((state: RootState) => state.config);

    const [order, setOrder] = useState<NewOrder | Order | null>(null);
    const [paytrailData, setPaytrailData] = useState<PaytrailData | null>(null);
    const [attemptedToFetchPaytrailData, setAttemptedToFetchPaytrailData] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedOrder = orderHandler.getOrder();
        if (storedOrder && validateOrder(storedOrder).length <= 0) {
            return setOrder(storedOrder);
        } else {
            navigate('/checkout');
        }
    }, [navigate]);

    useEffect(() => {
        if (order) {
            const createPayment = async () => {
                const data = await paytrailService.createPayment(order, configState);
                setPaytrailData(data.data);
                setAttemptedToFetchPaytrailData(true);
            };
            createPayment();
        }
    }, [order]);

    if (!order) {
        return (
            <div>
                <br />
                Order not found.
            </div>
        );
    }
    const parameterToInput = (param: { name: string; value: string }) => <input type='hidden' name={param.name} value={param.value} />;

    const responseToHtml = (response: { providers: PaytrailProvider[] }) => {
        return (
            <div className='flexWrapCenter'>
                {response.providers.map((provider) => (
                    <form method='POST' action={provider.url} key={provider.name} style={{ margin: '0.5rem' }}>
                        {provider.parameters.map((param) => (
                            <div key={param.name}>{parameterToInput(param)}</div>
                        ))}
                        <button className='paymentMethod'>
                            <img src={provider.svg} alt={provider.name} title={provider.name} style={{ height: '3rem', width: 'auto' }} />
                        </button>
                    </form>
                ))}
            </div>
        );
    };

    const htmlForm = paytrailData ? (
        responseToHtml(paytrailData)
    ) : (
        <div className='semiBold sizeLarge'>
            {attemptedToFetchPaytrailData ? (
                <>
                    Something went wrong.
                    <br />
                    <br />
                    Please <Link to='/info'>contact us</Link> or try again later.
                </>
            ) : (
                <>Loading...</>
            )}
        </div>
    );

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
                        <td width='1px' style={{ paddingTop: 0, verticalAlign: 'top' }}>
                            <table align='center' width='100%' className='paymentMethodSelection'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <table width='100%' className='noOuterPadding noWrap'>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <a href='https://www.paytrail.com/kuluttajille' target='_blank'>
                                                                <img src='https://www.helsinginlipputehdas.fi/verkkokauppa/paytrail-logo-70px.png' />
                                                            </a>
                                                        </td>
                                                        <td className='upperCase sizeSmallish' style={{ lineHeight: '1.5rem', textAlign: 'right', verticalAlign: 'top' }}>
                                                            <a href='https://www.paytrail.com/turvallisuus' target='_blank'>
                                                                Safety Information
                                                            </a>
                                                            <br />
                                                            <a href='https://www.paytrail.com/tietosuojaseloste-paytrailin-maksupalvelu' target='_blank'>
                                                                Data Privacy Notice
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <table width='100%' className='noPadding'>
                                                                <tbody>
                                                                    <tr>
                                                                        <td width='1px'>
                                                                            <h4 style={{ marginBottom: '1rem' }}>Payment Details</h4>
                                                                        </td>
                                                                        <td></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td width='1px' className='semiBold colorGraySemiDark' style={{ verticalAlign: 'top' }}>
                                                                            Payee
                                                                        </td>
                                                                        <td>
                                                                            {configState.owner.name}
                                                                            {configState.owner.businessIdentifier.length > 0 ? (
                                                                                <>
                                                                                    <br />
                                                                                    {configState.owner.businessIdentifier}
                                                                                </>
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className='semiBold colorGraySemiDark' style={{ paddingTop: '0.75rem' }}>
                                                                            Total Amount:
                                                                        </td>
                                                                        <td className='semiBold colorGoldLight' style={{ paddingTop: '0.75rem' }}>
                                                                            {format.currency(orderTotalSum(order), configState)}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                                            <h3>Select a Payment Method to Proceed</h3>
                                            {paytrailData ? <div dangerouslySetInnerHTML={{ __html: paytrailData.terms + '.' }} /> : <></>}
                                            <br />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{htmlForm}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='1rem'></td>
                        <td width='40%' style={{ verticalAlign: 'top', paddingTop: 0 }}>
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
                            <BackButton label='Abort payment' type='text' to='/checkout' />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOutPayment;

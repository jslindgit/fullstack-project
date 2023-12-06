import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { PaytrailData, PaytrailProvider } from '../types/orderTypes';

import { orderTotalSum } from '../util/checkoutProvider';
import { pageWidth } from '../constants';
import format from '../util/format';
import { contentToText } from '../types/languageFunctions';
import { isOrder, validateOrder } from '../types/orderTypeFunctions';
import paytrailService from '../services/paytrailService';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import OrderInfo from './OrderInfo';

const CheckOutPayment = () => {
    const config = useSelector((state: RootState) => state.config);
    const order = useSelector((state: RootState) => state.order);

    const [paytrailData, setPaytrailData] = useState<PaytrailData | null>(null);
    const [attemptedToFetchPaytrailData, setAttemptedToFetchPaytrailData] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (validateOrder(order, config).length > 0) {
            navigate('/checkout');
        }
    }, [config, navigate, order]);

    useEffect(() => {
        // If 'order' is Order (has been sent to backend), make an api call to initiate a Paytrail payment and receive the available payment methods:
        if (order && validateOrder(order, config) && isOrder(order)) {
            console.log('createPayment... order:', order);
            const createPayment = async () => {
                const data = await paytrailService.createPayment(order, config);
                setPaytrailData(data.data);
                setAttemptedToFetchPaytrailData(true);
            };
            createPayment();
        }
    }, [config, order]);

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
                            <h3 className='underlined'>{contentToText(ContentID.checkOutHeader, config)}</h3>
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
                                                                <img
                                                                    src='https://www.paytrail.com/hs-fs/hub/335946/file-493287103.png?width=200&name=file-493287103.png'
                                                                    width='70'
                                                                    height='70'
                                                                />
                                                            </a>
                                                        </td>
                                                        <td
                                                            className='upperCase sizeSmallish'
                                                            style={{ lineHeight: '1.5rem', textAlign: 'right', verticalAlign: 'top' }}
                                                        >
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
                                                                            {config.owner.name}
                                                                            {config.owner.businessIdentifier.length > 0 ? (
                                                                                <>
                                                                                    <br />
                                                                                    {config.owner.businessIdentifier}
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
                                                                            {format.currency(orderTotalSum(order), config)}
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
                            <BackButton labelContentID={ContentID.checkOutAbortPayment} type='text' to='/checkout' />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOutPayment;

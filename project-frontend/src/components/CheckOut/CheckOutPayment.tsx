import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { PaytrailData, PaytrailProvider } from '../../types/orderTypes';

import { orderTotalSum } from '../../util/checkoutProvider';
import format from '../../util/format';
import { contentToText } from '../../types/languageFunctions';
import { isOrder, validateOrder } from '../../types/orderTypeFunctions';
import paytrailService from '../../services/paytrailService';

import BackButton from '../BackButton';
import OrderInfo from '../OrderInfo';

const CheckOutPayment = () => {
    const config = useSelector((state: RootState) => state.config);
    const order = useSelector((state: RootState) => state.order);
    const userState = useSelector((state: RootState) => state.user);

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
            const createPayment = async () => {
                const data = await paytrailService.createPayment(order, config, userState.loggedUser ? userState.loggedUser.id : null);
                setPaytrailData(data.data);
                setAttemptedToFetchPaytrailData(true);
            };
            createPayment();
        }
    }, [config, order, userState.loggedUser]);

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
            <div data-testid='payment-providers' className='flexWrapCenter'>
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
                <>{contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config)}</>
            ) : (
                <>{contentToText(ContentID.miscLoading, config)}</>
            )}
        </div>
    );

    return (
        <div className='pageWidth'>
            <div className='pageHeader'>{contentToText(ContentID.checkOutHeader, config)}</div>
            <div className='grid-container' data-gap='4rem' style={{ gridTemplateColumns: '1fr 39%' }}>
                <div>
                    <div className='grid-container paymentMethodSelection' data-gap='2rem'>
                        <div className='grid-container' data-cols='2'>
                            <div className='alignLeft'>
                                <a href='https://www.paytrail.com/kuluttajille' target='_blank'>
                                    <img
                                        src='https://www.paytrail.com/hs-fs/hub/335946/file-493287103.png?width=200&name=file-493287103.png'
                                        width='70'
                                        height='70'
                                    />
                                </a>
                            </div>
                            <div className='alignRight grid-container sizeSmallish upperCase valignTop' data-gap='0.5rem' style={{ height: 'min-content' }}>
                                <a href='https://www.paytrail.com/turvallisuus' target='_blank'>
                                    {contentToText(ContentID.checkOutSafetyInformation, config)}
                                </a>
                                <a href='https://www.paytrail.com/tietosuojaseloste-paytrailin-maksupalvelu' target='_blank'>
                                    {contentToText(ContentID.checkOutDataPrivacyNotice, config)}
                                </a>
                            </div>
                        </div>
                        <div>
                            <div className='alignLeft bold sizeLarge' style={{ marginBottom: '1rem' }}>
                                {contentToText(ContentID.checkOutPaymentDetails, config)}
                            </div>
                            <div className='grid-container' data-cols='auto 1fr' data-gap='1rem'>
                                <div className='semiBold colorGraySemiDark'>{contentToText(ContentID.checkOutPayee, config)}</div>
                                <div className='alignLeft'>
                                    {config.owner.name}
                                    {config.owner.businessIdentifier.length > 0 && (
                                        <>
                                            <br />
                                            {config.owner.businessIdentifier}
                                        </>
                                    )}
                                </div>
                                <div className='semiBold colorGraySemiDark'>{contentToText(ContentID.orderTotalAmount, config)}</div>
                                <div className='alignLeft colorGoldLight semiBold'>{format.currency(orderTotalSum(order), config)}</div>
                            </div>
                        </div>
                        <div className='grid-container' data-gap='1rem'>
                            <div data-testid='payment-choose-method' className='alignLeft bold sizeVeryLarge'>
                                {contentToText(ContentID.checkOutChoosePaymentMethod, config)}
                            </div>
                            <div className='alignLeft'>{paytrailData && <div dangerouslySetInnerHTML={{ __html: paytrailData.terms + '.' }} />}</div>
                            <div>{htmlForm}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ position: 'sticky', top: '1rem' }}>
                        <OrderInfo order={order} />
                        <br />
                    </div>
                </div>
            </div>
            <br />
            <div className='alignLeft'>
                <BackButton labelContentID={ContentID.checkOutAbortPayment} type='text' to='/checkout' />
            </div>
            <br />
        </div>
    );
};

export default CheckOutPayment;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { DeliveryMethod } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';
import { validateOrder } from '../types/orderTypeFunctions';

import { setOrder } from '../reducers/orderReducer';

import BackButton from './BackButton';
import CheckOutContactInfo from './CheckOutContactInfo';
import CheckOutDelivery from './CheckOutDelivery';
import OrderInfo from './OrderInfo';

const CheckOut = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const order = useSelector((state: RootState) => state.order);
    const [validate, setValidate] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    const handlePaymentClick = () => {
        setValidate(true);

        const errors = validateOrder(order);

        setValidationErrors(errors);

        if (errors.length <= 0) {
            navigate('/payment');
        }
    };

    const setCustomerInfo = (
        address: string,
        city: string,
        country: string,
        email: string,
        firstName: string,
        lastName: string,
        organization: string,
        phone: string,
        zipCode: string
    ) => {
        dispatch(
            setOrder({
                ...order,
                customerAddress: address,
                customerCity: city,
                customerCountry: country,
                customerEmail: email,
                customerFirstName: firstName,
                customerLastName: lastName,
                customerPhone: phone,
                customerZipCode: zipCode,
                customerOrganization: organization,
            })
        );
    };

    const setDeliveryMethod = (deliveryMethod: DeliveryMethod | null) => {
        setOrder({ ...order, deliveryMethod: deliveryMethod });
    };

    useEffect(() => {
        setOrder({ ...order, deliveryCost: order.deliveryMethod ? order.deliveryMethod.cost : 0 });
    }, [order.deliveryMethod]);

    useEffect(() => {
        if (validate) {
            setValidationErrors(validateOrder(order));
        }
    }, [order, validate]);

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.checkOutHeader, config)}</td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            <CheckOutContactInfo currentOrder={order} setCustomerInfo={setCustomerInfo} validate={validate} width='100%' />
                            <br />
                            <CheckOutDelivery
                                currentMethod={order.deliveryMethod}
                                customerCountry={order.customerCountry}
                                customerZipCode={order.customerZipCode}
                                setDeliveryMethod={setDeliveryMethod}
                                validate={validate}
                                width='100%'
                            />
                        </td>
                        <td width='3rem'></td>
                        <td width='40%' style={{ verticalAlign: 'top', paddingTop: 0 }}>
                            <div style={{ position: 'sticky', top: '1rem' }}>
                                <OrderInfo order={order} />
                                {validationErrors.length > 0 ? (
                                    <table align='center' width='100%' className='validationErrors' style={{ borderRadius: '0.5rem', marginTop: '1rem' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ fontWeight: '500' }}>
                                                    Please check the following:
                                                    <div style={{ paddingTop: '1rem', paddingBottom: '0', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                                        {validationErrors.map((e) => (
                                                            <div key={e} style={{ fontStyle: 'italic', lineHeight: '2rem', fontWeight: '500' }}>
                                                                • {e}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    ''
                                )}
                                <button
                                    type='button'
                                    className='large'
                                    onClick={handlePaymentClick}
                                    disabled={validationErrors.length > 0}
                                    style={{ width: '100%', marginTop: '1rem' }}
                                >
                                    {contentToText(ContentID.checkOutChoosePaymentMethod, config)} →
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='text' to='/cart' />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOut;

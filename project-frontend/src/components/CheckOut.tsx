import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { DeliveryMethod } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';
import { NewUser } from '../types/types';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';
import { isValidPassword } from '../util/misc';
import { validateOrder } from '../types/orderTypeFunctions';
import useField from '../hooks/useField';
import { registerAndLogin } from '../util/userProvider';

import { setOrder } from '../reducers/orderReducer';

import BackButton from './BackButton';
import CheckOutContactInfo from './CheckOutContactInfo';
import CheckOutDelivery from './CheckOutDelivery';
import OrderInfo from './OrderInfo';

const CheckOut = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const order = useSelector((state: RootState) => state.order);

    const [register, setRegister] = useState<boolean>(false);
    const [validate, setValidate] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const password = useField('password', ContentID.loginPassword, '');
    const passwordConfirm = useField('password', ContentID.registerPasswordConfirm, '');

    const navigate = useNavigate();

    const handlePaymentClick = async () => {
        setValidate(true);

        const errors = validateOrder(order, config);

        if (register) {
            if (!isValidPassword(password.stringValue())) {
                errors.push(contentToText(ContentID.loginNewPasswordTooShort, config));
            } else if (passwordConfirm.value !== password.value) {
                errors.push(contentToText(ContentID.loginNewPasswordMisMatch, config));
            }

            if (errors.length <= 0) {
                const newUser: NewUser = {
                    admin: false,
                    contactAddress: order.customerAddress,
                    contactCity: order.customerCity,
                    contactCountry: order.customerCountry,
                    contactFirstName: order.customerFirstName,
                    contactLastName: order.customerLastName,
                    contactPhone: order.customerPhone,
                    contactZipcode: order.customerZipCode,
                    contactOrganization: order.customerOrganization,
                    disabled: false,
                    username: order.customerEmail,
                    operator: false,
                    orders: [],
                    password: password.stringValue(),
                };

                await registerAndLogin(newUser, password.stringValue(), config, dispatch);
            }
        }

        setValidationErrors(errors);

        if (errors.length <= 0) {
            navigate('/order');
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
        dispatch(setOrder({ ...order, deliveryMethod: deliveryMethod }));
    };

    useEffect(() => {
        dispatch(setOrder({ ...order, deliveryCost: order.deliveryMethod ? order.deliveryMethod.cost : 0 }));
    }, [order.deliveryMethod]);

    useEffect(() => {
        if (validate) {
            setValidationErrors(validateOrder(order, config));
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
                        <td style={{ paddingLeft: 0, paddingTop: 0 }}>
                            <CheckOutContactInfo
                                currentOrder={order}
                                password={password}
                                passwordConfirm={passwordConfirm}
                                register={register}
                                setCustomerInfo={setCustomerInfo}
                                setRegister={setRegister}
                                validate={validate}
                                width='100%'
                            />
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
                                                    {contentToText(ContentID.checkOutPleaseCheck, config)}
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
                                <br />
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

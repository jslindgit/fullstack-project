import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { DeliveryMethod } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';
import { NewUser } from '../types/types';

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
        if (
            order.customerAddress !== address ||
            order.customerCity !== city ||
            order.customerCountry !== country ||
            order.customerEmail !== email ||
            order.customerFirstName !== firstName ||
            order.customerLastName !== lastName ||
            order.customerOrganization !== organization ||
            order.customerPhone !== phone ||
            order.customerZipCode !== zipCode
        )
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
        if (order.deliveryCost !== order.deliveryMethod?.cost) {
            dispatch(setOrder({ ...order, deliveryCost: order.deliveryMethod ? order.deliveryMethod.cost : 0 }));
        }
    }, [dispatch, order]);

    useEffect(() => {
        if (validate) {
            setValidationErrors(validateOrder(order, config));
        }
    }, [config, order, validate]);

    return (
        <div className='pageWidth'>
            <div className='pageHeader'>{contentToText(ContentID.checkOutHeader, config)}</div>
            <div className='grid-container' data-gap='4rem' style={{ gridTemplateColumns: '1fr 39%' }}>
                <div className='grid-container' data-gap='1.5rem' style={{ marginBottom: '1.5rem' }}>
                    <CheckOutContactInfo
                        currentOrder={order}
                        password={password}
                        passwordConfirm={passwordConfirm}
                        register={register}
                        setCustomerInfo={setCustomerInfo}
                        setRegister={setRegister}
                        validate={validate}
                    />
                    <CheckOutDelivery
                        currentMethod={order.deliveryMethod}
                        customerCountry={order.customerCountry}
                        customerZipCode={order.customerZipCode}
                        order={order}
                        setDeliveryMethod={setDeliveryMethod}
                        validate={validate}
                    />
                    <div className='alignLeft'>
                        <BackButton type='text' to='/cart' />
                    </div>
                </div>
                <div>
                    <div className='grid-container' data-gap='1.5rem' style={{ position: 'sticky', top: '1rem' }}>
                        <OrderInfo order={order} />
                        {validationErrors.length > 0 && (
                            <>
                                <div className='alignLeft validationErrors'>
                                    {contentToText(ContentID.checkOutPleaseCheck, config)}
                                    {validationErrors.map((e) => (
                                        <div key={e} style={{ fontStyle: 'italic', fontWeight: '500', marginLeft: '1em', marginTop: '1em' }}>
                                            • {e}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <button
                            data-testid='checkout-button-choose-payment-method'
                            type='button'
                            className='large'
                            onClick={handlePaymentClick}
                            disabled={validationErrors.length > 0}
                            style={{ width: '100%' }}
                        >
                            {contentToText(ContentID.checkOutChoosePaymentMethod, config)} →
                        </button>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;

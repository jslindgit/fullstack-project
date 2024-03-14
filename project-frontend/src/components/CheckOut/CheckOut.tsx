import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../../content';
import { DeliveryMethod } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';
import { NewUser } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';
import { isValidPassword } from '../../util/misc';
import { validateOrder } from '../../util/orderProvider';
import useField from '../../hooks/useField';
import { registerAndLogin } from '../../util/userProvider';

import { setOrder } from '../../reducers/orderReducer';

import BackButton from '../BackButton';
import CheckOutContactInfo from './CheckOutContactInfo';
import CheckOutDelivery from './CheckOutDelivery';
import OrderInfo from '../OrderInfo';

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

    // Page title:
    useEffect(() => {
        document.title = contentToText(ContentID.checkOutHeader, config) + ' | ' + config.store.contactName;
    }, [config]);

    const validatePassword = useCallback((): string[] => {
        if (!isValidPassword(password.value.toString().trim())) {
            return [contentToText(ContentID.loginNewPasswordTooShort, config)];
        } else if (passwordConfirm.value !== password.value) {
            return [contentToText(ContentID.loginNewPasswordMisMatch, config)];
        }

        return [];
    }, [config, password.value, passwordConfirm.value]);

    const handlePaymentClick = async () => {
        setValidate(true);

        const errors = validateOrder(order, config);

        if (register) {
            errors.push(...validatePassword());

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

    const setCustomerInfo = useCallback(
        (
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
        },
        [dispatch, order]
    );

    const setDeliveryMethod = (deliveryMethod: DeliveryMethod | null) => {
        if (order.deliveryMethod?.code !== deliveryMethod?.code) {
            dispatch(setOrder({ ...order, deliveryMethod: deliveryMethod }));
        }
    };

    useEffect(() => {
        if (order.deliveryMethod && order.deliveryCost !== order.deliveryMethod.cost) {
            dispatch(setOrder({ ...order, deliveryCost: order.deliveryMethod ? order.deliveryMethod.cost : 0 }));
        }
    }, [dispatch, order]);

    useEffect(() => {
        if (validate) {
            const errs = validateOrder(order, config);

            if (register) {
                errs.push(...validatePassword());
            }

            setValidationErrors(errs);
        }
    }, [config, order, register, validate, validatePassword]);

    return (
        <div className='pageWidth'>
            <div className='pageHeader'>{contentToText(ContentID.checkOutHeader, config)}</div>
            <div className='grid-container' data-cols='check-out' data-gap='4rem'>
                <div className='grid-container marginBottom1_5' data-gap='1.5rem'>
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
                    <div className='grid-container stickyTop1rem' data-gap='1.5rem'>
                        <OrderInfo order={order} />
                        {validationErrors.length > 0 && (
                            <>
                                <div className='alignLeft validationErrors'>
                                    {contentToText(ContentID.checkOutPleaseCheck, config)}
                                    {validationErrors.map((e) => (
                                        <div key={e} className='italic marginLeft1 marginTop1 semiBold'>
                                            • {e}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <button
                            data-testid='checkout-button-choose-payment-method'
                            type='button'
                            className='large widthFull'
                            onClick={handlePaymentClick}
                            disabled={validationErrors.length > 0}
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

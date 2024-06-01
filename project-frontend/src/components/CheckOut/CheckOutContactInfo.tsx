import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { NewOrder, Order } from '../../types/orderTypes';
import { RootState } from '../../redux/rootReducer';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { isValidEmailAddress, isValidPassword } from '../../util/misc';
import useField, { UseField } from '../../hooks/useField';

import CheckBox from '../CheckBox';
import InputField from '../InputField';

interface Props {
    currentOrder: NewOrder | Order;
    password: UseField;
    passwordConfirm: UseField;
    register: boolean;
    setCustomerInfo: (
        address: string,
        city: string,
        country: string,
        email: string,
        firstName: string,
        lastName: string,
        organization: string,
        phone: string,
        zipCode: string
    ) => void;
    setRegister: React.Dispatch<React.SetStateAction<boolean>>;
    validate: boolean;
}

const CheckOutContactInfo = ({ currentOrder, password, passwordConfirm, setCustomerInfo, register, setRegister, validate }: Props) => {
    const config = useSelector((state: RootState) => state.config);
    const userState = useSelector((state: RootState) => state.user);

    const [availableCountries, setAvailableCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [invalidFields, setInvalidFields] = useState<ContentID[]>([]);
    const [required, setRequired] = useState<UseField[]>([]);

    // Default country:
    useEffect(() => {
        if (!country && userState.loggedUser) {
            setCountry(currentOrder.customerCountry.length > 0 ? currentOrder.customerCountry : userState.loggedUser.contactCountry);
        }
    }, [country, currentOrder.customerCountry, userState.loggedUser]);

    // In case the current country in the Order is set with a different language that is in use at the moment:
    useEffect(() => {
        const getCountryFromOrder = () => {
            config.store.deliveryCountries.forEach((c) => {
                if (c.names.find((langText) => langText.text === currentOrder.customerCountry)) {
                    setCountry(langTextsToText(c.names, config));
                }
            });
        };

        getCountryFromOrder();
    }, [config, config.language, currentOrder.customerCountry]);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountry(event.target.value);
    };

    const address = useField(
        'text',
        ContentID.checkOutStreetAddress,
        currentOrder.customerAddress.length > 0 ? currentOrder.customerAddress : userState.loggedUser ? userState.loggedUser.contactAddress : ''
    );
    const city = useField(
        'text',
        ContentID.checkOutCity,
        currentOrder.customerCity.length > 0 ? currentOrder.customerCity : userState.loggedUser ? userState.loggedUser.contactCity : ''
    );
    const email = useField(
        'text',
        ContentID.contactEmail,
        currentOrder.customerEmail.length > 0 ? currentOrder.customerEmail : userState.loggedUser ? userState.loggedUser.username : ''
    );
    const firstName = useField(
        'text',
        ContentID.checkOutFirstName,
        currentOrder.customerFirstName.length > 0 ? currentOrder.customerFirstName : userState.loggedUser ? userState.loggedUser.contactFirstName : ''
    );
    const lastName = useField(
        'text',
        ContentID.checkOutLastName,
        currentOrder.customerLastName.length > 0 ? currentOrder.customerLastName : userState.loggedUser ? userState.loggedUser.contactLastName : ''
    );
    // prettier-ignore
    const organization = useField(
        'text',
        ContentID.checkOutOrganization,
        currentOrder.customerOrganization && currentOrder.customerOrganization.length > 0
            ? currentOrder.customerOrganization : userState.loggedUser ? userState.loggedUser.contactOrganization : ''
    );
    const phone = useField(
        'text',
        ContentID.contactPhone,
        currentOrder.customerPhone.length > 0 ? currentOrder.customerPhone : userState.loggedUser ? userState.loggedUser.contactPhone : ''
    );
    const zipCode = useField(
        'text',
        ContentID.checkOutZipCode,
        currentOrder.customerZipCode.length > 0 ? currentOrder.customerZipCode : userState.loggedUser ? userState.loggedUser.contactZipcode : ''
    );

    const fillWithLoggedUserInfo = () => {
        if (userState.loggedUser) {
            address.setNewValue(userState.loggedUser.contactAddress);
            city.setNewValue(userState.loggedUser.contactCity);
            setCountry(userState.loggedUser.contactCountry);
            email.setNewValue(userState.loggedUser.username);
            firstName.setNewValue(userState.loggedUser.contactFirstName);
            lastName.setNewValue(userState.loggedUser.contactLastName);
            organization.setNewValue(userState.loggedUser.contactOrganization ? userState.loggedUser.contactOrganization : '');
            phone.setNewValue(userState.loggedUser.contactPhone);
            zipCode.setNewValue(userState.loggedUser.contactZipcode);
        }
    };

    const validateField = useCallback(
        (field: UseField): string | null => {
            let result = null;

            if (required.find((useField) => useField.label === field.label) && field.stringValue().length < 1) {
                result = `${contentToText(field.label, config)} ${contentToText(ContentID.checkOutIsRequired, config)}.`;
            } else if (field === email && !isValidEmailAddress(email.value.toString())) {
                result = contentToText(ContentID.errorInvalidEmailAddress, config);
            } else if (register) {
                if (field === password && !isValidPassword(field.stringValue())) {
                    result = contentToText(ContentID.loginNewPasswordTooShort, config);
                } else if (field === passwordConfirm && isValidPassword(password.stringValue()) && field.stringValue() !== password.stringValue()) {
                    result = contentToText(ContentID.loginNewPasswordMisMatch, config);
                }
            }

            if (result && !invalidFields.includes(field.label)) {
                setInvalidFields([...invalidFields, field.label]);
            } else if (!result && invalidFields.includes(field.label)) {
                setInvalidFields([...invalidFields].filter((contentId) => contentId !== field.label));
            }

            return result;
        },
        [config, email, invalidFields, password, passwordConfirm, register, required]
    );

    // Set required fields:
    useEffect(() => {
        if (required.length === 0) {
            setRequired([address, city, email, firstName, lastName, phone, zipCode]);
        }

        if (register && !(required.includes(password) && required.includes(passwordConfirm))) {
            setRequired([address, city, email, firstName, lastName, password, passwordConfirm, phone, zipCode]);
        } else if (
            !register &&
            (required.find((usefield) => usefield.label === password.label) || required.find((usefield) => usefield.label === passwordConfirm.label))
        ) {
            setRequired([address, city, email, firstName, lastName, phone, zipCode]);
        }
    }, [address, city, email, firstName, lastName, password, passwordConfirm, phone, register, required, zipCode]);

    // Set available countries:
    useEffect(() => {
        const countries: string[] = [];
        [...config.store.deliveryCountries]
            .sort((a, b) => langTextsToText(a.names, config).localeCompare(langTextsToText(b.names, config)))
            .forEach((c) => {
                countries.push(langTextsToText(c.names, config));
            });
        setAvailableCountries(countries);
    }, [config]);

    // Set customer info to the order:
    useEffect(() => {
        setCustomerInfo(
            address.value.toString().trim(),
            city.value.toString().trim(),
            country ? country : '',
            email.value.toString().trim(),
            firstName.value.toString().trim(),
            lastName.value.toString().trim(),
            organization.value.toString().trim(),
            phone.value.toString().trim(),
            zipCode.value.toString().trim()
        );
    }, [address.value, city.value, country, email.value, firstName.value, lastName.value, organization.value, phone.value, setCustomerInfo, zipCode.value]);

    const inputField = (field: UseField, testId: string, optional: boolean = false) => {
        const label = contentToText(field.label, config);
        const labelParts: string[] = optional ? [label, '(' + contentToText(ContentID.checkOutOptional, config) + ')'] : [label];
        const error = validateField(field);

        return (
            <React.Fragment>
                <div
                    className={
                        'valignMiddle' + (required.find((f) => f.label === field.label) || field === password || field === passwordConfirm ? ' semiBold' : '')
                    }
                >
                    {labelParts.length > 1 ? (
                        <div>
                            <div>{labelParts[0]}</div>
                            <div>
                                <i>{labelParts[1]}</i>
                            </div>
                        </div>
                    ) : (
                        <>{labelParts[0]}</>
                    )}
                </div>
                <div className='grid-container valignMiddle'>
                    {validate && error && (
                        <div className='validationError'>
                            {error}
                            <br />
                        </div>
                    )}
                    <InputField className={'checkOutInput' + (validate && error ? ' error' : '')} testId={testId} useField={field} width='100%' />
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className={'alignLeft infoBox' + (validate && invalidFields.length > 0 ? ' errors' : '')}>
            <div data-testid='checkout-contactinfo-header' className='infoHeader marginBottom2'>
                {contentToText(ContentID.checkOutCustomerContactInformation, config)}
            </div>
            <div className='grid-container left' data-cols='auto 1fr' data-gap='1.5em'>
                {userState.loggedUser && (
                    <div className='gridSpan2 marginBottom1'>
                        <a onClick={fillWithLoggedUserInfo}>
                            {contentToText(ContentID.checkOutFillAutomatically, config)} (
                            {`${userState.loggedUser.contactFirstName} ${userState.loggedUser.contactLastName}`})
                        </a>
                    </div>
                )}
                {inputField(firstName, 'checkout-firstname')}
                {inputField(lastName, 'checkout-lastname')}
                {inputField(organization, 'checkout-organization', true)}
                {inputField(address, 'checkout-address')}
                {inputField(zipCode, 'checkout-zipcode')}
                {inputField(city, 'checkout-city')}
                <div className='semiBold valignMiddle'>{contentToText(ContentID.checkOutCountry, config)}</div>
                <div>
                    {validate && !country ? (
                        <div className='validationError'>
                            {contentToText(ContentID.checkOutCountryIsRequired, config)}
                            <br />
                        </div>
                    ) : (
                        <></>
                    )}
                    <select data-testid='checkout-country' className='checkOutSelect' value={country || ''} onChange={handleCountryChange}>
                        <option value='' disabled>
                            {contentToText(ContentID.checkOutSelectCountry, config)}
                        </option>
                        {availableCountries.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                {inputField(email, 'checkout-email')}
                {inputField(phone, 'checkout-phone')}
            </div>
            <div>
                {!userState.loggedUser && (
                    <div className='marginTop3'>
                        <div className='grid-container' data-cols='auto 1fr' data-gap='0.5rem'>
                            <CheckBox
                                isChecked={register}
                                onClick={() => {
                                    setRegister(!register);
                                }}
                            />
                            <div className='semiBold'>{contentToText(ContentID.registerHeader, config)}</div>
                        </div>
                        <div className={register ? '' : 'hidden'}>
                            <div className='grid-container left marginTop1_5' data-cols='auto 1fr' data-gap='1rem'>
                                {inputField(password, 'checkout-password')}
                                {inputField(passwordConfirm, 'checkout-password-confirm')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckOutContactInfo;

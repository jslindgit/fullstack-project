import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useField, { UseField } from '../hooks/useField';

import { ContentID } from '../content';
import { NewOrder, Order } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import dev from '../util/dev';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { isValidEmailAddress } from '../util/misc';

interface Props {
    currentOrder: NewOrder | Order;
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
    validate: boolean;
    width: string;
}

const CheckOutContactInfo = ({ currentOrder, setCustomerInfo, validate, width }: Props) => {
    const config = useSelector((state: RootState) => state.config);
    const userState = useSelector((state: RootState) => state.user);

    const [availableCountries, setAvailableCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(currentOrder.customerCountry.length > 0 ? currentOrder.customerCountry : null);
    const [errors, setErrors] = useState<boolean>(false);
    const [register, setRegister] = useState<boolean>(false);

    useEffect(() => {
        // In case the current country in the Order is set with a different language that is in use at the moment:
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

    const address = useField('text', ContentID.checkOutStreetAddress, currentOrder.customerAddress);
    const city = useField('text', ContentID.checkOutCity, currentOrder.customerCity);
    const email = useField('text', ContentID.contactEmail, currentOrder.customerEmail);
    const firstName = useField('text', ContentID.checkOutFirstName, currentOrder.customerFirstName);
    const lastName = useField('text', ContentID.checkOutLastName, currentOrder.customerLastName);
    const organization = useField('text', ContentID.checkOutOrganization, currentOrder.customerOrganization);
    const phone = useField('text', ContentID.contactPhone, currentOrder.customerPhone);
    const zipCode = useField('text', ContentID.checkOutZipCode, currentOrder.customerZipCode);

    const password = useField('password', ContentID.loginPassword, '');
    const passwordConfirm = useField('password', ContentID.accountPasswordNewConfirm, '');

    const required: UseField[] = [address, city, email, firstName, lastName, phone, zipCode];

    const fillRandomly = () => {
        const zipCity = dev.randomZipCodeAndCity();

        address.setNewValue(dev.randomStreetAddress());
        city.setNewValue(zipCity.city);
        setCountry('Suomi');
        email.setNewValue(dev.randomEmail());
        firstName.setNewValue(dev.randomFirstName());
        lastName.setNewValue(dev.randomLastName());
        organization.setNewValue(dev.randomOrganization());
        phone.setNewValue(dev.randomPhone());
        zipCode.setNewValue(zipCity.zip);
    };

    const validateField = (field: UseField): string | null => {
        if (required.includes(field) && field.value.toString().trim().length < 1) {
            return `${contentToText(field.label, config)} ${contentToText(ContentID.checkOutIsRequired, config)}.`;
        } else if (field === email && !isValidEmailAddress(email.value.toString())) {
            return contentToText(ContentID.errorInvalidEmailAddress, config);
        }
        return null;
    };

    useEffect(() => {
        const countries: string[] = [];
        config.store.deliveryCountries.forEach((c) => {
            countries.push(langTextsToText(c.names, config));
        });
        setAvailableCountries(countries);
    }, [config]);

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
    }, [address.value, city.value, country, email.value, firstName.value, lastName.value, organization.value, phone.value, zipCode.value]);

    useEffect(() => {
        if (validate) {
            let errs = false;
            required.forEach((field) => {
                if (validateField(field)) {
                    errs = true;
                    return;
                }
            });

            setErrors(errs);
        } else {
            setErrors(false);
        }
    }, [required, validate]);

    const inputField = (field: UseField, optional: boolean = false) => {
        const label = contentToText(field.label, config);
        const labelParts: string[] = optional ? [label, contentToText(ContentID.checkOutOptional, config)] : [label];
        const error = validateField(field);

        return (
            <tr>
                <td className={'widthByContent' + (required.includes(field) || field === password || field === passwordConfirm ? ' semiBold' : '')}>
                    {labelParts.length > 1 ? (
                        <>
                            {labelParts[0]}
                            <br />
                            <i>{labelParts[1]}</i>
                        </>
                    ) : (
                        <>{labelParts[0]}</>
                    )}
                </td>
                <td style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
                    {validate && error ? (
                        <div className='validationError'>
                            {error}
                            <br />
                        </div>
                    ) : (
                        <></>
                    )}
                    <input type={field.type} value={field.value} onChange={field.onChange} className={validate && error ? 'error' : ''} />
                </td>
            </tr>
        );
    };

    return (
        <table className={'infoBox' + (errors ? ' errors' : '')} width={width}>
            <tbody>
                <tr>
                    <td>
                        <table align='center' width='100%' className='paddingTopBottomOnly'>
                            <tbody>
                                <tr>
                                    <td style={{ paddingTop: 0 }}>
                                        <div className='pageHeader' style={{ paddingTop: 0 }}>
                                            {contentToText(ContentID.checkOutCustomerContactInformation, config)}
                                        </div>
                                        <a onClick={fillRandomly}>Fill randomly</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table align='center' width='100%' className='paddingTopBottomOnly' style={{ paddingRight: '1rem' }}>
                            <tbody>
                                {inputField(firstName)}
                                {inputField(lastName)}
                                {inputField(organization, true)}
                                {inputField(address)}
                                {inputField(zipCode)}
                                {inputField(city)}

                                <tr>
                                    <td className='widthByContent semiBold'>{contentToText(ContentID.checkOutCountry, config)}</td>
                                    <td style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
                                        {validate && !country ? (
                                            <div className='validationError'>
                                                {contentToText(ContentID.checkOutCountryIsRequired, config)}
                                                <br />
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        <select value={country || ''} onChange={handleCountryChange}>
                                            <option value='' disabled>
                                                {contentToText(ContentID.checkOutSelectCountry, config)}
                                            </option>
                                            {availableCountries.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>

                                {inputField(email)}
                                {inputField(phone)}

                                {!userState.loggedUser ? (
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={2} style={{ paddingTop: '1em' }}>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ paddingLeft: 0 }}>
                                                                <input type='checkbox' className='checkbox' onChange={() => setRegister(!register)} />
                                                            </td>
                                                            <td>Register</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        {register ? (
                                            <React.Fragment>
                                                <tr>
                                                    <td colSpan={2}>
                                                        <table>
                                                            <tbody>
                                                                {inputField(password)}
                                                                {inputField(passwordConfirm)}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ) : (
                                            ''
                                        )}
                                    </React.Fragment>
                                ) : (
                                    ''
                                )}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default CheckOutContactInfo;

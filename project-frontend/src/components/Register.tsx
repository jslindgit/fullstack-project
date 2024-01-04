import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useField, { UseField } from '../hooks/useField';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { NewUser } from '../types/types';

import { pageWidth } from '../constants';
import dev from '../util/dev';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { isValidEmailAddress, isValidPassword } from '../util/misc';
import { registerAndLogin } from '../util/userProvider';

import BackButton from './BackButton';

const Register = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [availableCountries, setAvailableCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [validate, setValidate] = useState<boolean>(false);

    const navigate = useNavigate();

    const address = useField('text', ContentID.checkOutStreetAddress);
    const city = useField('text', ContentID.checkOutCity);
    const email = useField('text', ContentID.contactEmail);
    const firstName = useField('text', ContentID.checkOutFirstName);
    const lastName = useField('text', ContentID.checkOutLastName);
    const organization = useField('text', ContentID.checkOutOrganization);
    const password = useField('password', ContentID.loginPassword);
    const passwordConfirm = useField('password', ContentID.registerPasswordConfirm);
    const phone = useField('text', ContentID.contactPhone);
    const zipCode = useField('text', ContentID.checkOutZipCode);

    const required: UseField[] = [address, city, email, firstName, lastName, password, passwordConfirm, phone, zipCode];

    useEffect(() => {
        document.title = contentToText(ContentID.registerHeader, config) + ' | ' + config.store.contactName;
    }, [config]);

    const fillRandomly = () => {
        const zipCity = dev.randomZipCodeAndCity();
        const first = dev.randomFirstName();
        const last = dev.randomLastName();

        address.setNewValue(dev.randomStreetAddress());
        city.setNewValue(zipCity.city);
        setCountry('Suomi');
        email.setNewValue(dev.randomEmail(first, last));
        firstName.setNewValue(first);
        lastName.setNewValue(last);
        organization.setNewValue(dev.randomOrganization());
        phone.setNewValue(dev.randomPhone());
        zipCode.setNewValue(zipCity.zip);
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountry(event.target.value);
    };

    const handleSubmit = async () => {
        setValidate(true);

        const errors: string[] = [];
        required.forEach((field) => {
            const error = validateField(field);
            if (error) {
                errors.push(error);
            }
        });

        if (errors.length <= 0) {
            const newUser: NewUser = {
                admin: false,
                contactAddress: address.stringValue(),
                contactCity: city.stringValue(),
                contactCountry: country ? country : '-',
                contactFirstName: firstName.stringValue(),
                contactLastName: lastName.stringValue(),
                contactPhone: phone.stringValue(),
                contactZipcode: zipCode.stringValue(),
                contactOrganization: organization.stringValue(),
                disabled: false,
                username: email.stringValue(),
                operator: false,
                orders: [],
                password: password.stringValue(),
            };

            await registerAndLogin(newUser, password.stringValue(), config, dispatch);
        }
    };

    const validateField = (field: UseField): string | null => {
        if (required.includes(field) && field.stringValue().length < 1) {
            return `${contentToText(field.label, config)} ${contentToText(ContentID.checkOutIsRequired, config)}.`;
        } else if (field === email && !isValidEmailAddress(email.value.toString())) {
            return contentToText(ContentID.errorInvalidEmailAddress, config);
        } else if (field === password && !isValidPassword(password.stringValue())) {
            return contentToText(ContentID.loginNewPasswordTooShort, config);
        } else if (field === passwordConfirm && field.value !== password.value) {
            return contentToText(ContentID.loginNewPasswordMisMatch, config);
        }
        return null;
    };

    useEffect(() => {
        if (usersState.loggedUser) {
            navigate('/you');
        }
    }, [navigate, usersState.loggedUser]);

    useEffect(() => {
        const countries: string[] = [];
        config.store.deliveryCountries.forEach((c) => {
            countries.push(langTextsToText(c.names, config));
        });
        setAvailableCountries(countries);
    }, [config]);

    const inputField = (field: UseField, optional: boolean = false) => {
        const label = contentToText(field.label, config);
        const labelParts: string[] = optional ? [label, '(' + contentToText(ContentID.checkOutOptional, config) + ')'] : [label];
        const error = validateField(field);

        return (
            <tr>
                <td className={'widthByContent' + (required.includes(field) ? ' semiBold' : '')}>
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
                <td style={{ paddingTop: '1em', paddingBottom: '1em' }}>
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
        <>
            <table align='center' width={pageWidth * 0.66} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td className='pageHeader widthByContent'>{contentToText(ContentID.registerHeader, config)}</td>
                        <td>
                            <a onClick={fillRandomly}>Fill randomly</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth * 0.66}>
                <tbody>
                    {inputField(email)}
                    {inputField(password)}
                    {inputField(passwordConfirm)}
                    {inputField(firstName)}
                    {inputField(lastName)}
                    {inputField(organization, true)}
                    {inputField(phone)}
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
                    <tr>
                        <td>
                            <BackButton type='text' size='sizeNormal' />
                        </td>
                        <td>
                            <button type='button' onClick={handleSubmit}>
                                {contentToText(ContentID.buttonSubmit, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default Register;

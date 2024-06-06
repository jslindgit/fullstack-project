import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useField, { UseField } from '../hooks/useField';

import { ContentID } from '../content';
import { RootState } from '../redux/rootReducer';
import { NewUser } from '../types/types';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import { isValidEmailAddress, isValidPassword } from '../util/misc';
import { registerAndLogin, usernameIsAvailable } from '../util/userProvider';

import store from '../redux/store';

import BackButton from './BackButton';
import InputField from './InputField';

const Register = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [availableCountries, setAvailableCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [usernameAvailableError, setUsernameAvailableError] = useState<string | null>(null);
    const [validate, setValidate] = useState<boolean>(false);

    const navigate = useNavigate();

    const address = useField('text', ContentID.checkOutStreetAddress);
    const city = useField('text', ContentID.checkOutCity);
    const email = useField('text', ContentID.loginUsername);
    const firstName = useField('text', ContentID.checkOutFirstName);
    const lastName = useField('text', ContentID.checkOutLastName);
    const organization = useField('text', ContentID.checkOutOrganization);
    const password = useField('password', ContentID.loginPassword);
    const passwordConfirm = useField('password', ContentID.registerPasswordConfirm);
    const phone = useField('phone', ContentID.contactPhone);
    const zipCode = useField('text', ContentID.checkOutZipCode);

    const required: UseField[] = [address, city, email, firstName, lastName, password, passwordConfirm, phone, zipCode];

    // Page title:
    useEffect(() => {
        document.title = contentToText(ContentID.registerHeader, config) + ' | ' + config.store.contactName;
    }, [config]);

    // If already logged in, go to account page:
    useEffect(() => {
        if (usersState.loggedUser) {
            navigate('/you');
        }
    }, [navigate, usersState.loggedUser]);

    // Set available countries:
    useEffect(() => {
        setAvailableCountries(
            [...config.store.deliveryCountries]
                .sort((a, b) => langTextsToText(a.names, config).localeCompare(langTextsToText(b.names, config)))
                .map((c) => langTextsToText(c.names, config))
        );
    }, [config]);

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
            // Check if the email (username) is available:
            if ((await usernameIsAvailable(email.stringValue(), store.dispatch)) === false) {
                setUsernameAvailableError(
                    `${contentToText(ContentID.loginUsername, config)} ${email.stringValue()} ${contentToText(ContentID.errorUsernameInUse, config)}`
                );
            } else {
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

                await registerAndLogin(newUser, password.stringValue(), config, dispatch, store.dispatch);
            }
        }
    };

    const validateField = (field: UseField): string | null => {
        if (required.includes(field) && field.stringValue().length < 1) {
            return `${contentToText(field.label, config)} ${contentToText(ContentID.checkOutIsRequired, config)}.`;
        } else if (field === email && !isValidEmailAddress(email.stringValue())) {
            return contentToText(ContentID.errorInvalidEmailAddress, config);
        } else if (field === password && !isValidPassword(password.stringValue())) {
            return contentToText(ContentID.loginNewPasswordTooShort, config);
        } else if (field === passwordConfirm && field.value !== password.value) {
            return contentToText(ContentID.loginNewPasswordMisMatch, config);
        }

        return null;
    };

    const inputField = (field: UseField, optional: boolean = false) => {
        const label = contentToText(field.label, config);
        const labelParts: string[] = optional ? [label, '(' + contentToText(ContentID.checkOutOptional, config) + ')'] : [label];

        let error = validateField(field);

        if (!error && field === email && usernameAvailableError) {
            error = usernameAvailableError;
        }

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
                    <InputField useField={field} width='100%' className={validate && error ? 'error' : ''} />
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className='divCenter divMaxWidth40rem'>
            <div data-testid='register-header' className='pageHeader'>
                {contentToText(ContentID.registerHeader, config)}
            </div>
            <div className='grid-container left marginBottom1_5' data-cols='auto 1fr' data-gap='1.5rem'>
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
                <div className='semiBold'>{contentToText(ContentID.checkOutCountry, config)}</div>
                <div>
                    {validate && !country && (
                        <div className='validationError'>
                            {contentToText(ContentID.checkOutCountryIsRequired, config)}
                            <br />
                        </div>
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
                </div>
                <div>
                    <BackButton type='text' size='sizeNormal' />
                </div>
                <div>
                    <button type='button' onClick={handleSubmit}>
                        {contentToText(ContentID.buttonSubmit, config)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;

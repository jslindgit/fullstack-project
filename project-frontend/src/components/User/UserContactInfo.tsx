import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { User } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { isValidEmailAddress } from '../../util/misc';
import useField, { UseField } from '../../hooks/useField';
import { usernameIsAvailable } from '../../services/userService';

import { setNotification } from '../../redux/miscReducer';
import store from '../../redux/store';

import InputField from '../InputField';

interface Props {
    addLinkToEmail?: boolean;
    config: Config;
    updateUserInfo: ((toUpdate: object, propertyName: ContentID) => Promise<void>) | null;
    user: User;
}
const UserContactInfo = ({ addLinkToEmail = false, config, updateUserInfo, user }: Props) => {
    type infoType = '' | 'address' | 'city' | 'country' | 'email' | 'phone' | 'zipcode';

    const dispatch = useDispatch();

    const [availableCountries, setAvailableCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string | null>(null);
    const [editedInfo, setEditedInfo] = useState<infoType>('');

    const address = useField('text', null, user.contactAddress);
    const city = useField('text', null, user.contactCity);
    const email = useField('text', null, user.username);
    const phone = useField('phone', null, user.contactPhone);
    const zipcode = useField('text', null, user.contactZipcode);

    // Set available countries:
    useEffect(() => {
        setAvailableCountries(
            [...config.store.deliveryCountries]
                .sort((a, b) => langTextsToText(a.names, config).localeCompare(langTextsToText(b.names, config)))
                .map((c) => langTextsToText(c.names, config))
        );
    }, [config]);

    // Set initial country selection:
    useEffect(() => {
        if (country === null && availableCountries.length > 0) {
            const currentCountry = config.store.deliveryCountries.find((country) => country.names.find((langText) => langText.text === user.contactCountry));
            if (currentCountry) {
                setCountry(langTextsToText(currentCountry.names, config));
            }
        }
    }, [availableCountries, config, country, user.contactCountry]);

    const cancelChanges = () => {
        setEditedInfo('');

        address.reset();
        city.reset();
        email.reset();
        phone.reset();
        zipcode.reset();
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountry(event.target.value);
    };

    const submitChanges = async (toUpdate: object, propertyName: ContentID) => {
        if (updateUserInfo) {
            // If username (e-mail address) is being updated, check that the new one isn't already taken:
            const usernameAvailable = email.stringValue() === user.username || (await usernameIsAvailable(email.stringValue(), store.dispatch));

            if (usernameAvailable) {
                await updateUserInfo(toUpdate, propertyName);
            } else {
                dispatch(
                    setNotification({
                        tone: 'Negative',
                        message: `${contentToText(ContentID.loginUsername, config)} ${email.stringValue()} ${contentToText(
                            ContentID.errorUsernameInUse,
                            config
                        )}`,
                    })
                );
            }
        }

        setEditedInfo('');
    };

    const info = (info: infoType, useField: UseField, toUpdate: object, currentValue: string, buttonLabel: ContentID) => (
        <>
            {editedInfo === info ? (
                <>
                    <div>
                        <InputField useField={useField} width='100%' autoFocus={true} />
                    </div>
                    <div>
                        <div className='grid-container' data-cols='2' data-gap='1rem'>
                            <button
                                type='button'
                                onClick={() => submitChanges(toUpdate, buttonLabel)}
                                disabled={useField.stringValue() === currentValue || (info === 'email' && !isValidEmailAddress(useField.stringValue()))}
                            >
                                {contentToText(ContentID.buttonSave, config)}
                            </button>
                            <button type='button' onClick={cancelChanges}>
                                {contentToText(ContentID.buttonCancel, config)}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div>{useField === email && addLinkToEmail ? <a href={'mailto:' + currentValue}>{currentValue}</a> : <>{currentValue}</>}</div>
                    {updateUserInfo ? (
                        <div className='alignRight'>
                            <button type='button' onClick={() => setEditedInfo(info)}>
                                {contentToText(ContentID.miscChange, config)} {contentToText(buttonLabel, config)}
                            </button>
                        </div>
                    ) : (
                        <div />
                    )}
                </>
            )}
        </>
    );

    return (
        <div className='infoBox userInfo'>
            <div className='infoHeader'>{contentToText(ContentID.accountContactInfo, config)}</div>
            <div className='grid-container left' data-cols='user-info' data-gap='1rem 2rem'>
                <div className='bold'>{contentToText(ContentID.contactEmail, config)}:</div>
                {info('email', email, { username: email.stringValue() }, user.username, ContentID.contactEmail)}

                <div className='bold'>{contentToText(ContentID.contactPhone, config)}:</div>
                {info('phone', phone, { contactPhone: phone.stringValue() }, user.contactPhone, ContentID.contactPhone)}

                <div className='bold'>{contentToText(ContentID.checkOutStreetAddress, config)}:</div>
                {info('address', address, { contactAddress: address.stringValue() }, user.contactAddress, ContentID.checkOutStreetAddress)}

                <div className='bold'>{contentToText(ContentID.checkOutZipCode, config)}:</div>
                {info('zipcode', zipcode, { contactZipcode: zipcode.stringValue() }, user.contactZipcode, ContentID.checkOutZipCode)}

                <div className='bold'>{contentToText(ContentID.checkOutCity, config)}:</div>
                {info('city', city, { contactCity: city.stringValue() }, user.contactCity, ContentID.checkOutCity)}

                <div className='bold'>{contentToText(ContentID.checkOutCountry, config)}:</div>
                {editedInfo === 'country' ? (
                    <>
                        <div>
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
                            <div className='grid-container' data-cols='2' data-gap='1rem'>
                                <button
                                    type='button'
                                    onClick={() => submitChanges({ contactCountry: country }, ContentID.checkOutCountry)}
                                    disabled={country === user.contactCountry}
                                >
                                    {contentToText(ContentID.buttonSave, config)}
                                </button>
                                <button type='button' onClick={cancelChanges}>
                                    {contentToText(ContentID.buttonCancel, config)}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>{user.contactCountry}</div>
                        {updateUserInfo ? (
                            <div className='alignRight'>
                                <button type='button' onClick={() => setEditedInfo('country')}>
                                    {contentToText(ContentID.miscChange, config)} {contentToText(ContentID.checkOutCountry, config)}
                                </button>
                            </div>
                        ) : (
                            <div />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserContactInfo;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Country, Settings } from '../../types/types';

import { availableDeliveryCountries } from '../../constants';
import { useLangFields } from '../../hooks/useLang';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { LangField, LangText } from '../../types/languageTypes';
import settingsService from '../../services/settingsService';
import useField, { UseField } from '../../hooks/useField';

import { setNotification } from '../../reducers/miscReducer';

import CheckBox from '../CheckBox';
import InputField from '../InputField';

const AdminSettings = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const userState = useSelector((state: RootState) => state.user);

    const ownerBusinessIdentifierField = useField('text', null, config.owner.businessIdentifier);
    const ownerEmailField = useField('text', null, config.owner.email);
    const ownerNameField = useField('text', null, config.owner.name);
    const ownerPhoneField = useField('text', null, config.owner.phone);
    const storeAddressField = useField('text', null, config.store.contactStreetAddress);
    const storeCityField = useField('text', null, config.store.contactCity);
    const storeCountryFields = useLangFields('text');
    const [storeDeliveryCountries, setStoreDeliveryCountries] = useState<Country[]>(config.store.deliveryCountries);
    const storeDeliveryTimeField = useField('integer', null, config.store.deliveryTimeBusinessDays.toString());
    const storeEmailField = useField('text', null, config.store.contactEmail);
    const storeNameField = useField('text', null, config.store.contactName);
    const storePhoneField = useField('text', null, config.store.contactPhone);
    const storeZipcodeField = useField('text', null, config.store.contactZipcode);
    const storeWelcomeFields = useLangFields('text');
    const vatField = useField('decimal', null, config.vat.toString());

    type PropertyName =
        | ''
        | 'ownerBusinessIdentifier'
        | 'ownerEmail'
        | 'ownerName'
        | 'ownerPhone'
        | 'storeAddress'
        | 'storeCity'
        | 'storeCountry'
        | 'storeDeliveryCountries'
        | 'storeDeliveryTime'
        | 'storeDescription'
        | 'storeEmail'
        | 'storeName'
        | 'storePhone'
        | 'storeZipcode'
        | 'vat'
        | 'storeWelcome';

    const [editedProperty, setEditedProperty] = useState<PropertyName>('');

    // Initial values:
    useEffect(() => {
        if (editedProperty !== 'storeCountry') {
            storeCountryFields.forEach((langField) => {
                config.store.contactCountry.names.forEach((langText) => {
                    if (langText.langCode === langField.langCode) {
                        langField.field.setNewValue(langText.text);
                    }
                });
            });
        }

        if (editedProperty !== 'storeWelcome') {
            storeWelcomeFields.forEach((langField) => {
                config.store.welcome.forEach((langText) => {
                    if (langText.langCode === langField.langCode) {
                        langField.field.setNewValue(langText.text);
                    }
                });
            });
        }
    }, [config, editedProperty, storeCountryFields, storeWelcomeFields]);

    const deliveryCountryIsSelected = (country: Country): boolean => {
        return storeDeliveryCountries.map((c) => JSON.stringify(c)).includes(JSON.stringify(country));
    };

    const deliveryCountryList = (): string => {
        const names = storeDeliveryCountries.map((c) => langTextsToText(c.names, config));
        return names.sort().join(', ');
    };

    const deliveryCountrySelection = () => {
        const availableSorted = [...availableDeliveryCountries].sort((a, b) =>
            langTextsToText(a.names, config).localeCompare(langTextsToText(b.names, config))
        );

        return (
            <div className='grid-container' data-gap='0.5rem' style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                {availableSorted.map((c) => (
                    <div key={JSON.stringify(c.names)} className='grid-container' data-gap='0.5rem' style={{ gridTemplateColumns: 'auto 1fr' }}>
                        <div>
                            <CheckBox
                                isChecked={deliveryCountryIsSelected(c)}
                                onClick={() => {
                                    if (deliveryCountryIsSelected(c)) {
                                        setStoreDeliveryCountries(storeDeliveryCountries.filter((dc) => JSON.stringify(dc) !== JSON.stringify(c)));
                                    } else {
                                        setStoreDeliveryCountries([...storeDeliveryCountries, c]);
                                    }
                                }}
                            />
                        </div>
                        <div>{langTextsToText(c.names, config)}</div>
                    </div>
                ))}
            </div>
        );
    };

    const langFieldsToLangTexts = (langFields: LangField[]): LangText[] => {
        return langFields.map((langField) => {
            return { langCode: langField.langCode, text: langField.field.stringValue() };
        });
    };

    const settingLangFields = (label: string, langFields: LangField[], propertyName: PropertyName, currentValue: LangText[]) => {
        return (
            <div className={editedProperty !== propertyName ? 'buttonHighlight' : ''} style={{ display: 'contents' }}>
                <div className='alignLeft semiBold underlinedGridItem valignMiddle' style={{ padding: '1rem' }}>
                    {label}:&emsp;&emsp;&emsp;
                </div>
                <div className='alignLeft underlinedGridItem valignMiddle'>
                    {editedProperty === propertyName ? (
                        <div className='grid-container' style={{ gridTemplateColumns: 'auto 1fr' }}>
                            {langFields.map((langField) => (
                                <React.Fragment key={langField.langCode}>
                                    <div className='valignMiddle' style={{ padding: '1rem 0', paddingRight: '1rem' }}>
                                        {langField.langCode}
                                    </div>
                                    <div className='valignMiddle'>
                                        <InputField useField={langField.field} width='100%' minWidth='10rem' />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        langTextsToText(currentValue, config)
                    )}
                    &emsp;&emsp;&emsp;
                </div>
                <div className='alignRight underlinedGridItem valignMiddle'>
                    {editedProperty === propertyName ? (
                        <>
                            <button
                                type='button'
                                onClick={submitChanges}
                                disabled={JSON.stringify(langFieldsToLangTexts(langFields)) === JSON.stringify(currentValue)}
                            >
                                {contentToText(ContentID.buttonSave, config)}
                            </button>
                            &emsp;
                            <button
                                type='button'
                                onClick={() => {
                                    langFields.forEach((langField) => {
                                        currentValue.forEach((langText) => {
                                            if (langField.langCode === langText.langCode) {
                                                langField.field.setNewValue(langText.text);
                                            }
                                        });
                                    });
                                    setEditedProperty('');
                                }}
                            >
                                {contentToText(ContentID.buttonCancel, config)}
                            </button>
                        </>
                    ) : (
                        <>
                            <button type='button' onClick={() => setEditedProperty(propertyName)}>
                                {contentToText(ContentID.buttonEdit, config)}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const settingText = (label: string, useField: UseField, propertyName: PropertyName, currentValue: string) => (
        <div className={editedProperty !== propertyName ? 'buttonHighlight' : ''} style={{ display: 'contents' }}>
            <div className='alignLeft semiBold underlinedGridItem valignMiddle' style={{ padding: '1rem' }}>
                {label}:&emsp;&emsp;&emsp;
            </div>
            <div className='alignLeft underlinedGridItem valignMiddle'>
                {editedProperty === propertyName ? <InputField useField={useField} width={'100%'} minWidth='20rem' autoFocus={true} /> : useField.stringValue()}
                &emsp;&emsp;&emsp;
            </div>
            <div className='alignRight underlinedGridItem valignMiddle'>
                {editedProperty === propertyName ? (
                    <>
                        <button type='button' onClick={submitChanges} disabled={useField.stringValue() === currentValue}>
                            {contentToText(ContentID.buttonSave, config)}
                        </button>
                        &emsp;
                        <button
                            type='button'
                            onClick={() => {
                                useField.setNewValue(currentValue);
                                setEditedProperty('');
                            }}
                        >
                            {contentToText(ContentID.buttonCancel, config)}
                        </button>
                    </>
                ) : (
                    <>
                        <button type='button' onClick={() => setEditedProperty(propertyName)}>
                            {contentToText(ContentID.buttonEdit, config)}
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    const submitChanges = async () => {
        if (userState.loggedUser?.admin) {
            const settings: Settings = {
                ownerBusinessIdentifier: ownerBusinessIdentifierField.stringValue(),
                ownerEmail: ownerEmailField.stringValue(),
                ownerName: ownerNameField.stringValue(),
                ownerPhone: ownerPhoneField.stringValue(),
                storeContactCity: storeCityField.stringValue(),
                storeContactCountry: {
                    names: langFieldsToLangTexts(storeCountryFields),
                },
                storeContactEmail: storeEmailField.stringValue(),
                storeContactPhone: storePhoneField.stringValue(),
                storeContactStreetAddress: storeAddressField.stringValue(),
                storeContactZipcode: storeZipcodeField.stringValue(),
                storeDeliveryCountries: [...storeDeliveryCountries],
                storeDeliveryTimeBusinessDays: storeDeliveryTimeField.numValue(),
                storeName: storeNameField.stringValue(),
                storeWelcome: langFieldsToLangTexts(storeWelcomeFields),
                vat: vatField.numValue(),
            };

            const res = await settingsService.update(settings, userState.loggedUser.token, dispatch);
            dispatch(setNotification({ message: res.message, tone: res.success ? 'Positive' : 'Negative' }));

            setEditedProperty('');
        }
    };

    return (
        <div>
            <div className='grid-container pageWidth' data-gap='3rem'>
                <div className='infoBox'>
                    <div className='infoHeader'>{contentToText(ContentID.miscWebstore, config)}</div>
                    <div className='grid-container underlinedDiv' data-gap='0' style={{ gridTemplateColumns: 'auto auto 1fr', marginTop: '2rem' }}>
                        {settingText(contentToText(ContentID.miscName, config), storeNameField, 'storeName', config.store.contactName)}
                        {settingText(contentToText(ContentID.contactEmail, config), storeEmailField, 'storeEmail', config.store.contactEmail)}
                        {settingText(contentToText(ContentID.contactPhone, config), storePhoneField, 'storePhone', config.store.contactPhone)}
                        {settingText(contentToText(ContentID.miscAddress, config), storeAddressField, 'storeAddress', config.store.contactStreetAddress)}
                        {settingText(contentToText(ContentID.checkOutZipCode, config), storeZipcodeField, 'storeZipcode', config.store.contactZipcode)}
                        {settingText(contentToText(ContentID.checkOutCity, config), storeCityField, 'storeCity', config.store.contactCity)}
                        {settingLangFields(
                            contentToText(ContentID.checkOutCountry, config),
                            storeCountryFields,
                            'storeCountry',
                            config.store.contactCountry.names
                        )}
                        <div className={editedProperty !== 'storeDeliveryCountries' ? 'buttonHighlight' : ''} style={{ display: 'contents' }}>
                            <div className='alignLeft semiBold underlinedGridItem valignMiddle' style={{ padding: '1rem' }}>
                                {contentToText(ContentID.miscDeliveryCountries, config)}:
                            </div>
                            <div className='alignLeft underlinedGridItem valignMiddle'>
                                {editedProperty === 'storeDeliveryCountries' ? <>{deliveryCountrySelection()}</> : <>{deliveryCountryList()}</>}
                            </div>
                            <div className='alignRight underlinedGridItem valignMiddle'>
                                {editedProperty === 'storeDeliveryCountries' ? (
                                    <>
                                        <button
                                            type='button'
                                            onClick={submitChanges}
                                            disabled={
                                                JSON.stringify(
                                                    [...storeDeliveryCountries].sort((a, b) =>
                                                        langTextsToText(a.names, config).localeCompare(langTextsToText(b.names, config))
                                                    )
                                                ) ===
                                                JSON.stringify(
                                                    [...config.store.deliveryCountries].sort((a, b) =>
                                                        langTextsToText(a.names, config).localeCompare(langTextsToText(b.names, config))
                                                    )
                                                )
                                            }
                                        >
                                            {contentToText(ContentID.buttonSave, config)}
                                        </button>
                                        &emsp;
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setStoreDeliveryCountries([...config.store.deliveryCountries]);
                                                setEditedProperty('');
                                            }}
                                        >
                                            {contentToText(ContentID.buttonCancel, config)}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type='button' onClick={() => setEditedProperty('storeDeliveryCountries')}>
                                            {contentToText(ContentID.buttonEdit, config)}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {settingText(
                            `${contentToText(ContentID.miscDeliveryTime, config)} (${contentToText(ContentID.miscDays, config)})`,
                            storeDeliveryTimeField,
                            'storeDeliveryTime',
                            config.store.deliveryTimeBusinessDays.toString()
                        )}
                        {settingText(contentToText(ContentID.miscVAT, config) + '-%', vatField, 'vat', config.vat.toString())}
                    </div>
                </div>
                <div className='infoBox'>
                    <div className='infoHeader'>{contentToText(ContentID.miscMerchant, config)}</div>
                    <div className='grid-container underlinedDiv' data-gap='0' style={{ gridTemplateColumns: 'auto auto 1fr', marginTop: '2rem' }}>
                        {settingText(contentToText(ContentID.miscName, config), ownerNameField, 'ownerName', config.owner.name)}
                        {settingText(contentToText(ContentID.contactEmail, config), ownerEmailField, 'ownerEmail', config.owner.email)}
                        {settingText(contentToText(ContentID.contactPhone, config), ownerPhoneField, 'ownerPhone', config.owner.phone)}
                        {settingText(
                            contentToText(ContentID.contactBusinessID, config),
                            ownerBusinessIdentifierField,
                            'ownerBusinessIdentifier',
                            config.owner.businessIdentifier
                        )}
                    </div>
                </div>
                <div className='infoBox'>
                    <div className='infoHeader'>{contentToText(ContentID.miscContent, config)}</div>
                    <div className='grid-container underlinedDiv' data-gap='0' style={{ gridTemplateColumns: 'auto auto 1fr', marginTop: '2rem' }}>
                        {settingLangFields(
                            `"${contentToText(ContentID.contentWelcome, config)}" (${contentToText(ContentID.menuHome, config)})`,
                            storeWelcomeFields,
                            'storeWelcome',
                            config.store.welcome
                        )}
                    </div>
                </div>
            </div>
            <br />
            <br />
        </div>
    );
};

export default AdminSettings;

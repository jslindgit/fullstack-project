import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';
import { Settings } from '../../types/settingsTypes';
import { Country } from '../../types/types';

import { availableDeliveryCountries } from '../../constants';
import { useLangFields } from '../../hooks/useLang';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { LangField, LangText } from '../../types/languageTypes';
import settingsService from '../../services/settingsService';
import useField, { UseField } from '../../hooks/useField';

import { setNotification } from '../../redux/miscReducer';
import { useSettingsGetQuery } from '../../redux/slices/settingsSlice';
import store from '../../redux/store';

import CheckBox from '../CheckBox';
import InputField from '../InputField';
import LoadingQuery from '../LoadingQuery';

const AdminSettings = () => {
    const settingsGet = useSettingsGetQuery();

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const userState = useSelector((state: RootState) => state.user);

    const ownerBusinessIdentifierField = useField('text', null, settingsGet.data?.ownerBusinessIdentifier);
    const ownerEmailField = useField('text', null, settingsGet.data?.ownerEmail);
    const ownerNameField = useField('text', null, settingsGet.data?.ownerName);
    const ownerPhoneField = useField('text', null, settingsGet.data?.ownerPhone);
    const storeAddressField = useField('text', null, settingsGet.data?.storeContactStreetAddress);
    const storeCityField = useField('text', null, settingsGet.data?.storeContactCity);
    const storeCountryFields = useLangFields('text');
    const [storeDeliveryCountries, setStoreDeliveryCountries] = useState<Country[]>(settingsGet.data ? settingsGet.data.storeDeliveryCountries : []);
    const storeDeliveryTimeField = useField('integer', null, settingsGet.data?.storeDeliveryTimeBusinessDays.toString());
    const storeEmailField = useField('text', null, settingsGet.data?.storeContactEmail);
    const storeNameField = useField('text', null, settingsGet.data?.storeName);
    const storePhoneField = useField('text', null, settingsGet.data?.storeContactPhone);
    const storeZipcodeField = useField('text', null, settingsGet.data?.storeContactZipcode);
    const storeWelcomeFields = useLangFields('text');
    const vatField = useField('decimal', null, settingsGet.data?.vat.toString());

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
                settingsGet.data?.storeContactCountry.names.forEach((langText) => {
                    if (langText.langCode === langField.langCode) {
                        langField.field.setNewValue(langText.text);
                    }
                });
            });
        }

        if (editedProperty !== 'storeWelcome') {
            storeWelcomeFields.forEach((langField) => {
                settingsGet.data?.storeWelcome.forEach((langText) => {
                    if (langText.langCode === langField.langCode) {
                        langField.field.setNewValue(langText.text);
                    }
                });
            });
        }
    }, [editedProperty, settingsGet.data, storeCountryFields, storeWelcomeFields]);

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
            <div className='grid-container marginBottom1 marginTop1' data-gap='0.5rem'>
                {availableSorted.map((c) => (
                    <div key={JSON.stringify(c.names)} className='grid-container' data-cols='auto 1fr' data-gap='0.5rem'>
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
            <div className={'displayContents underlinedGridItem ' + (editedProperty !== propertyName ? 'buttonHighlight' : '')}>
                <div className='adminSettingsBreakWord adminSettingsLabelCol alignLeft paddingRight1em semiBold valignMiddle'>{label}:</div>
                <div className='alignLeft paddingRight1em valignMiddle'>
                    {editedProperty === propertyName ? (
                        <div className='grid-container' data-cols='auto 1fr'>
                            {langFields.map((langField) => (
                                <React.Fragment key={langField.langCode}>
                                    <div className='padding1 paddingLeft0 valignMiddle'>{langField.langCode}</div>
                                    <div className='valignMiddle'>
                                        <InputField className='narrow' useField={langField.field} width='100%' />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        langTextsToText(currentValue, config)
                    )}
                </div>
                <div className='alignRight padding0_5em valignMiddle'>
                    {editedProperty === propertyName ? (
                        <div className='grid-container' data-gap='1em'>
                            <button
                                type='button'
                                onClick={submitChanges}
                                disabled={JSON.stringify(langFieldsToLangTexts(langFields)) === JSON.stringify(currentValue || !userState.loggedUser?.admin)}
                                title={!userState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''}
                            >
                                {contentToText(ContentID.buttonSave, config)}
                            </button>
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
                        </div>
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
        <div className={'displayContents underlinedGridItem ' + (editedProperty !== propertyName ? 'buttonHighlight' : '')}>
            <div className='adminSettingsBreakWord adminSettingsLabelCol alignLeft paddingRight1em semiBold valignMiddle'>{label}:</div>
            <div className='alignLeft paddingRight1em valignMiddle'>
                {editedProperty === propertyName ? (
                    <InputField className='narrow' useField={useField} width={'100%'} autoFocus={true} />
                ) : (
                    useField.stringValue()
                )}
            </div>
            <div className='alignRight padding0_5em valignMiddle'>
                {editedProperty === propertyName ? (
                    <div className='grid-container' data-gap='1em'>
                        <button
                            type='button'
                            onClick={submitChanges}
                            disabled={useField.stringValue() === currentValue || !userState.loggedUser?.admin}
                            title={!userState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''}
                        >
                            {contentToText(ContentID.buttonSave, config)}
                        </button>
                        <button
                            type='button'
                            onClick={() => {
                                useField.setNewValue(currentValue);
                                setEditedProperty('');
                            }}
                        >
                            {contentToText(ContentID.buttonCancel, config)}
                        </button>
                    </div>
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
        if (userState.loggedUser?.admin && settingsGet.data) {
            const newSettings: Settings = {
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

            const res = await settingsService.updateSettings(settingsGet.data, newSettings, store.dispatch, config);
            dispatch(setNotification({ message: res.message, tone: res.success ? 'Positive' : 'Negative' }));

            setEditedProperty('');
        }
    };

    if (!settingsGet.data) {
        return <LoadingQuery query={settingsGet} config={config} />;
    }

    return (
        <div>
            <div className='grid-container pageWidth' data-gap='3rem'>
                <div className='adminFormDiv'>
                    <div className='infoHeader'>{contentToText(ContentID.miscWebstore, config)}</div>
                    <div className='adminSettings grid-container' data-cols='admin-settings' data-gap='0'>
                        {settingText(contentToText(ContentID.miscName, config), storeNameField, 'storeName', settingsGet.data.storeName)}
                        {settingText(contentToText(ContentID.contactEmail, config), storeEmailField, 'storeEmail', settingsGet.data.storeContactEmail)}
                        {settingText(contentToText(ContentID.contactPhone, config), storePhoneField, 'storePhone', settingsGet.data.storeContactPhone)}
                        {settingText(
                            contentToText(ContentID.miscAddress, config),
                            storeAddressField,
                            'storeAddress',
                            settingsGet.data.storeContactStreetAddress
                        )}
                        {settingText(contentToText(ContentID.checkOutZipCode, config), storeZipcodeField, 'storeZipcode', settingsGet.data.storeContactZipcode)}
                        {settingText(contentToText(ContentID.checkOutCity, config), storeCityField, 'storeCity', settingsGet.data.storeContactCity)}
                        {settingLangFields(
                            contentToText(ContentID.checkOutCountry, config),
                            storeCountryFields,
                            'storeCountry',
                            settingsGet.data.storeContactCountry.names
                        )}
                        <div className={'displayContents underlinedGridItem ' + (editedProperty !== 'storeDeliveryCountries' ? 'buttonHighlight' : '')}>
                            <div className='adminSettingsBreakWord adminSettingsLabelCol alignLeft paddingRight1em semiBold valignMiddle'>
                                {contentToText(ContentID.miscDeliveryCountries, config)}:
                            </div>
                            <div className='alignLeft paddingRight1em valignMiddle'>
                                {editedProperty === 'storeDeliveryCountries' ? <>{deliveryCountrySelection()}</> : <>{deliveryCountryList()}</>}
                            </div>
                            <div className='alignRight padding0_5em valignMiddle'>
                                {editedProperty === 'storeDeliveryCountries' ? (
                                    <div className='grid-container' data-gap='1em'>
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
                                                        [...settingsGet.data.storeDeliveryCountries].sort((a, b) =>
                                                            langTextsToText(a.names, config).localeCompare(langTextsToText(b.names, config))
                                                        )
                                                    ) || !userState.loggedUser?.admin
                                            }
                                            title={!userState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''}
                                        >
                                            {contentToText(ContentID.buttonSave, config)}
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setStoreDeliveryCountries(settingsGet.data ? [...settingsGet.data.storeDeliveryCountries] : []);
                                                setEditedProperty('');
                                            }}
                                        >
                                            {contentToText(ContentID.buttonCancel, config)}
                                        </button>
                                    </div>
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
                            settingsGet.data.storeDeliveryTimeBusinessDays.toString()
                        )}
                        {settingText(contentToText(ContentID.miscVAT, config) + '-%', vatField, 'vat', settingsGet.data.vat.toString())}
                    </div>
                </div>
                <div className='adminFormDiv adminSettings'>
                    <div className='infoHeader'>{contentToText(ContentID.miscMerchant, config)}</div>
                    <div className='grid-container striped' data-cols='admin-settings' data-gap='0'>
                        {settingText(contentToText(ContentID.miscName, config), ownerNameField, 'ownerName', settingsGet.data.ownerName)}
                        {settingText(contentToText(ContentID.contactEmail, config), ownerEmailField, 'ownerEmail', settingsGet.data.ownerEmail)}
                        {settingText(contentToText(ContentID.contactPhone, config), ownerPhoneField, 'ownerPhone', settingsGet.data.ownerPhone)}
                        {settingText(
                            contentToText(ContentID.contactBusinessID, config),
                            ownerBusinessIdentifierField,
                            'ownerBusinessIdentifier',
                            settingsGet.data.ownerBusinessIdentifier
                        )}
                    </div>
                </div>
                <div className='adminFormDiv adminSettings'>
                    <div className='infoHeader'>{contentToText(ContentID.miscContent, config)}</div>
                    <div className='grid-container' data-cols='admin-settings' data-gap='0'>
                        {settingLangFields(
                            `"${contentToText(ContentID.contentWelcome, config)}" (${contentToText(ContentID.menuHome, config)})`,
                            storeWelcomeFields,
                            'storeWelcome',
                            settingsGet.data.storeWelcome
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

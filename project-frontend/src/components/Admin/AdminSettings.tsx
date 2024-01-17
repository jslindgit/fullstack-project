import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Country, Settings } from '../../types/types';

import { availableDeliveryCountries, pageWidth } from '../../constants';
import { contentToText, langTextsToText, useLangFields } from '../../types/languageFunctions';
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
    const vatField = useField('integer', null, config.vat.toString());

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

    const initLangFields = () => {
        storeCountryFields.forEach((langField) => {
            config.store.contactCountry.names.forEach((langText) => {
                if (langText.langCode === langField.langCode) {
                    langField.field.setNewValue(langText.text);
                }
            });
        });

        storeWelcomeFields.forEach((langField) => {
            config.store.welcome.forEach((langText) => {
                if (langText.langCode === langField.langCode) {
                    langField.field.setNewValue(langText.text);
                }
            });
        });
    };

    // Initial values:
    useEffect(() => {
        initLangFields();
    }, [config]);

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
            <>
                {availableSorted.map((c) => (
                    <div key={JSON.stringify(c.names)}>
                        <table className='noPadding'>
                            <tbody>
                                <tr>
                                    <td style={{ border: 0, padding: '0.25rem' }}>
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
                                    </td>
                                    <td style={{ border: 0 }}>{langTextsToText(c.names, config)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </>
        );
    };

    const langFieldsToLangTexts = (langFields: LangField[]): LangText[] => {
        return langFields.map((langField) => {
            return { langCode: langField.langCode, text: langField.field.stringValue() };
        });
    };

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

    const propertyLangFields = (label: string, langFields: LangField[], propertyName: PropertyName, currentValue: LangText[]) => {
        return (
            <tr className='underlinedRow'>
                <td className='semiBold widthByContent'>{label}:</td>
                <td className='widthByContent'>
                    {editedProperty === propertyName ? (
                        <table>
                            <tbody>
                                {langFields.map((langField) => (
                                    <tr key={langField.langCode}>
                                        <td style={{ borderBottom: 0, paddingLeft: 0 }}>{langField.langCode}</td>
                                        <td style={{ borderBottom: 0 }}>
                                            <InputField useField={langField.field} width='100%' minWidth='10rem' />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        langTextsToText(currentValue, config)
                    )}
                </td>
                <td>
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
                                    initLangFields();
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
                </td>
            </tr>
        );
    };

    const propertyText = (label: string, useField: UseField, propertyName: PropertyName, currentValue: string) => (
        <tr className='underlinedRow'>
            <td className='semiBold widthByContent' style={{ padding: '0.75rem' }}>
                {label}:&emsp;
            </td>
            <td className='widthByContent'>
                {editedProperty === propertyName ? <InputField useField={useField} width={'100%'} minWidth='20rem' autoFocus={true} /> : useField.stringValue()}
                &emsp;&emsp;
            </td>
            <td>
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
            </td>
        </tr>
    );

    return (
        <div>
            <table align='center' width={pageWidth} className='infoBox'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='bold sizeVeryLarge underlined' style={{ paddingBottom: '1.5rem' }}>
                            {contentToText(ContentID.miscWebstore, config)}
                        </td>
                    </tr>
                    {propertyText(contentToText(ContentID.miscName, config), storeNameField, 'storeName', config.store.contactName)}
                    {propertyText(contentToText(ContentID.contactEmail, config), storeEmailField, 'storeEmail', config.store.contactEmail)}
                    {propertyText(contentToText(ContentID.contactPhone, config), storePhoneField, 'storePhone', config.store.contactPhone)}
                    {propertyText(contentToText(ContentID.miscAddress, config), storeAddressField, 'storeAddress', config.store.contactStreetAddress)}
                    {propertyText(contentToText(ContentID.checkOutZipCode, config), storeZipcodeField, 'storeZipcode', config.store.contactZipcode)}
                    {propertyText(contentToText(ContentID.checkOutCity, config), storeCityField, 'storeCity', config.store.contactCity)}
                    {propertyLangFields(
                        contentToText(ContentID.checkOutCountry, config),
                        storeCountryFields,
                        'storeCountry',
                        config.store.contactCountry.names
                    )}
                    <tr className='underlinedRow'>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.miscDeliveryCountries, config)}:&nbsp;</td>
                        <td className='widthByContent'>
                            {editedProperty === 'storeDeliveryCountries' ? <>{deliveryCountrySelection()}</> : <>{deliveryCountryList()}</>}
                        </td>
                        <td>
                            {editedProperty === 'storeDeliveryCountries' ? (
                                <>
                                    <button
                                        type='button'
                                        onClick={submitChanges}
                                        disabled={JSON.stringify(storeDeliveryCountries) === JSON.stringify(config.store.deliveryCountries)}
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
                        </td>
                    </tr>
                    {propertyText(
                        `${contentToText(ContentID.miscDeliveryTime, config)} (${contentToText(ContentID.miscDays, config)})`,
                        storeDeliveryTimeField,
                        'storeDeliveryTime',
                        config.store.deliveryTimeBusinessDays.toString()
                    )}
                    {propertyText(contentToText(ContentID.miscVAT, config) + '-%', vatField, 'vat', config.vat.toString())}
                </tbody>
            </table>
            <br />
            <br />
            <table align='center' width={pageWidth} className='infoBox'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='bold sizeVeryLarge underlined' style={{ paddingBottom: '1.5rem' }}>
                            {contentToText(ContentID.miscMerchant, config)}
                        </td>
                    </tr>
                    {propertyText(contentToText(ContentID.miscName, config), ownerNameField, 'ownerName', config.owner.name)}
                    {propertyText(contentToText(ContentID.contactEmail, config), ownerEmailField, 'ownerEmail', config.owner.email)}
                    {propertyText(contentToText(ContentID.contactPhone, config), ownerPhoneField, 'ownerPhone', config.owner.phone)}
                    {propertyText(
                        contentToText(ContentID.contactBusinessID, config),
                        ownerBusinessIdentifierField,
                        'ownerBusinessIdentifier',
                        config.owner.businessIdentifier
                    )}
                </tbody>
            </table>
            <br />
            <br />
            <table align='center' width={pageWidth} className='infoBox'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='bold sizeVeryLarge underlined' style={{ paddingBottom: '1.5rem' }}>
                            {contentToText(ContentID.miscContent, config)}
                        </td>
                    </tr>
                    {propertyLangFields(
                        `"${contentToText(ContentID.contentWelcome, config)}" (${contentToText(ContentID.menuHome, config)})`,
                        storeWelcomeFields,
                        'storeWelcome',
                        config.store.welcome
                    )}
                </tbody>
            </table>
            <br />
            <br />
        </div>
    );
};

export default AdminSettings;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Settings } from '../../types/types';

import { defaultConfig, pageWidth } from '../../constants';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import settingsService from '../../services/settingsService';
import useField, { UseField } from '../../hooks/useField';
import { useLangFields } from '../../types/languageFunctions';
import { LangField } from '../../types/languageTypes';

import { setNotification } from '../../reducers/miscReducer';

import InputField from '../InputField';

const AdminSettings = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const userState = useSelector((state: RootState) => state.user);

    const storeAddressField = useField('text', null, config.store.contactStreetAddress);
    const storeCityField = useField('text', null, config.store.contactCity);
    const storeCountryFields = useLangFields('text');
    const storeEmailField = useField('text', null, config.store.contactEmail);
    const storeNameField = useField('text', null, config.store.contactName);
    const storePhoneField = useField('text', null, config.store.contactPhone);
    const storeZipcodeField = useField('text', null, config.store.contactZipcode);

    type PropertyName = '' | 'storeAddress' | 'storeCity' | 'storeCountry' | 'storeEmail' | 'storeName' | 'storePhone' | 'storeZipcode';

    const [editedProperty, setEditedProperty] = useState<PropertyName>('');

    // Set initial values for 'langFields':
    useEffect(() => {
        storeCountryFields.forEach((langField) => {
            config.store.contactCountry.names.forEach((langText) => {
                if (langText.langCode === langField.langCode) {
                    langField.field.setNewValue(langText.text);
                }
            });
        });
    }, [config, storeCountryFields]);

    const submitChanges = async () => {
        if (userState.loggedUser?.admin) {
            const settings: Settings = {
                ownerBusinessIdentifier: defaultConfig.owner.businessIdentifier,
                ownerEmail: defaultConfig.owner.email,
                ownerName: defaultConfig.owner.name,
                ownerPhone: defaultConfig.owner.phone,
                storeContactCity: storeCityField.stringValue(),
                storeContactCountry: {
                    names: storeCountryFields.map((langField) => {
                        return { langCode: langField.langCode, text: langField.field.stringValue() };
                    }),
                },
                storeContactEmail: storeEmailField.stringValue(),
                storeContactPhone: storePhoneField.stringValue(),
                storeContactStreetAddress: storeAddressField.stringValue(),
                storeContactZipcode: storeZipcodeField.stringValue(),
                storeDeliveryCountries: defaultConfig.store.deliveryCountries,
                storeDeliveryTimeBusinessDays: defaultConfig.store.deliveryTimeBusinessDays,
                storeDescription: defaultConfig.store.description,
                storeName: storeNameField.stringValue(),
                storeWelcome: defaultConfig.store.welcome,
                vat: defaultConfig.vat,
            };

            const res = await settingsService.update(settings, userState.loggedUser.token, dispatch);
            dispatch(setNotification({ message: res.message, tone: res.success ? 'Positive' : 'Negative' }));

            setEditedProperty('');
        }
    };

    const propertyLangFields = (label: ContentID, langFields: LangField[], propertyName: PropertyName) => (
        <tr className='underlinedRow'>
            <td className='semiBold widthByContent'>{contentToText(label, config)}:</td>
            <td className='widthByContent'>
                {editedProperty === propertyName ? (
                    <table>
                        <tbody>
                            {langFields.map((langField) => (
                                <tr>
                                    <td>{langField.langCode}</td>
                                    <td>
                                        <InputField useField={langField.field} width='30rem' />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    langTextsToText(config.store.contactCountry.names, config)
                )}
            </td>
            <td>
                {editedProperty === propertyName ? (
                    <>
                        <button type='button' onClick={submitChanges}>
                            {contentToText(ContentID.buttonSave, config)}
                        </button>
                        &emsp;
                        <button type='button' onClick={() => setEditedProperty('')}>
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

    const propertyText = (label: ContentID, useField: UseField, propertyName: PropertyName) => (
        <tr className='underlinedRow'>
            <td className='semiBold widthByContent'>{contentToText(label, config)}:</td>
            <td className='widthByContent'>
                {editedProperty === propertyName ? <InputField useField={useField} width={'30rem'} autoFocus={true} /> : useField.stringValue()}
                &emsp;&emsp;
            </td>
            <td>
                {editedProperty === propertyName ? (
                    <>
                        <button type='button' onClick={submitChanges}>
                            {contentToText(ContentID.buttonSave, config)}
                        </button>
                        &emsp;
                        <button type='button' onClick={() => setEditedProperty('')}>
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
                    {propertyText(ContentID.miscName, storeNameField, 'storeName')}
                    {propertyText(ContentID.contactEmail, storeEmailField, 'storeEmail')}
                    {propertyText(ContentID.contactPhone, storePhoneField, 'storePhone')}
                    {propertyText(ContentID.miscAddress, storeAddressField, 'storeAddress')}
                    {propertyText(ContentID.checkOutZipCode, storeZipcodeField, 'storeZipcode')}
                    {propertyText(ContentID.checkOutCity, storeCityField, 'storeCity')}
                    {propertyLangFields(ContentID.checkOutCountry, storeCountryFields, 'storeCountry')}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSettings;

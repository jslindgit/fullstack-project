import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Settings } from '../../types/types';

import { defaultConfig, pageWidth } from '../../constants';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import settingsService from '../../services/settingsService';
import useField, { UseField } from '../../hooks/useField';

import { setNotification } from '../../reducers/miscReducer';

import InputField from '../InputField';

const AdminSettings = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const userState = useSelector((state: RootState) => state.user);

    const storeNameField = useField('text', null, config.store.contactName);
    const storeEmailField = useField('text', null, config.store.contactEmail);
    const storePhoneField = useField('text', null, config.store.contactPhone);

    type VisibleField = '' | 'storeName' | 'storeEmail' | 'storePhone';

    const [visibleField, setVisibleField] = useState<VisibleField>('');

    const submitChanges = async () => {
        if (userState.loggedUser?.admin) {
            const settings: Settings = {
                ownerBusinessIdentifier: defaultConfig.owner.businessIdentifier,
                ownerEmail: defaultConfig.owner.email,
                ownerName: defaultConfig.owner.name,
                ownerPhone: defaultConfig.owner.phone,
                storeContactCity: defaultConfig.store.contactCity,
                storeContactCountry: defaultConfig.store.contactCountry,
                storeContactEmail: defaultConfig.store.contactEmail,
                storeContactPhone: defaultConfig.store.contactPhone,
                storeContactZipcode: defaultConfig.store.contactZipcode,
                storeDeliveryCountries: defaultConfig.store.deliveryCountries,
                storeDeliveryTimeBusinessDays: defaultConfig.store.deliveryTimeBusinessDays,
                storeDescription: defaultConfig.store.description,
                storeName: storeNameField.stringValue(),
                storeWelcome: defaultConfig.store.welcome,
                vat: defaultConfig.vat,
            };

            const res = await settingsService.update(settings, userState.loggedUser.token, dispatch);
            dispatch(setNotification({ message: res.message, tone: res.success ? 'Positive' : 'Negative' }));
        }
    };

    const property = (label: ContentID, useField: UseField, fieldName: VisibleField) => (
        <tr>
            <td className='semiBold widthByContent'>{contentToText(label, config)}:</td>
            <td className='widthByContent'>{visibleField === fieldName ? <InputField useField={useField} width={'30rem'} /> : useField.stringValue()}</td>
            <td>
                {visibleField === fieldName ? (
                    <>
                        <button type='button' onClick={submitChanges}>
                            {contentToText(ContentID.buttonSave, config)}
                        </button>
                        &emsp;
                        <button type='button' onClick={() => setVisibleField('')}>
                            {contentToText(ContentID.buttonCancel, config)}
                        </button>
                    </>
                ) : (
                    <>
                        <button type='button' onClick={() => setVisibleField(fieldName)}>
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
                        <td colSpan={3} className='bold sizeLarge'>
                            {contentToText(ContentID.miscWebstore, config)}
                        </td>
                    </tr>
                    {property(ContentID.miscName, storeNameField, 'storeName')}
                    {property(ContentID.contactEmail, storeEmailField, 'storeEmail')}
                    {property(ContentID.contactPhone, storePhoneField, 'storePhone')}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSettings;

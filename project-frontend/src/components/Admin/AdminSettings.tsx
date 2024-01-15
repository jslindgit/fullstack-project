import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';

import { pageWidth } from '../../constants';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import useField, { UseField } from '../../hooks/useField';

import InputField from '../InputField';

const AdminSettings = () => {
    const config = useSelector((state: RootState) => state.config);

    const storeNameField = useField('text', null, config.store.contactName);
    const storeEmailField = useField('text', null, config.store.contactEmail);
    const storePhoneField = useField('text', null, config.store.contactPhone);

    type VisibleField = '' | 'storeName' | 'storeEmail' | 'storePhone';

    const [visibleField, setVisibleField] = useState<VisibleField>('');

    const submitChanges = () => {};

    return (
        <div>
            <table align='center' width={pageWidth} className='infoBox'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='bold sizeLarge'>
                            {contentToText(ContentID.miscWebstore, config)}
                        </td>
                    </tr>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.miscName, config)}:</td>
                        <td className='widthByContent'>
                            {visibleField === 'storeName' ? <InputField useField={storeNameField} width={'30rem'} /> : config.store.contactName}
                        </td>
                        <td>
                            <button type='button' onClick={() => setVisibleField('storeName')}>
                                {contentToText(ContentID.buttonEdit, config)}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.contactEmail, config)}:</td>
                        <td className='widthByContent'>{config.store.contactEmail}</td>
                        <td>
                            <button type='button'>{contentToText(ContentID.buttonEdit, config)}</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.contactPhone, config)}:</td>
                        <td className='widthByContent'>{config.store.contactPhone}</td>
                        <td>
                            <button type='button'>{contentToText(ContentID.buttonEdit, config)}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminSettings;

import { useState } from 'react';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';
import useField, { UseField } from '../hooks/useField';

import InputField from './InputField';

interface Props {
    addLinkToEmail?: boolean;
    config: Config;
    updateUserInfo: (toUpdate: object) => Promise<void>;
    user: User;
}
const UserContactInfo = ({ addLinkToEmail = false, config, updateUserInfo, user }: Props) => {
    type infoType = '' | 'address' | 'city' | 'phone' | 'zipcode';
    const [editedInfo, setEditedInfo] = useState<infoType>('');

    const address = useField('text', null, user.contactAddress);
    const city = useField('text', null, user.contactCity);
    const phone = useField('text', null, user.contactPhone);
    const zipcode = useField('text', null, user.contactZipcode);

    const cancelChanges = () => {
        setEditedInfo('');

        address.reset();
        city.reset();
        phone.reset();
        zipcode.reset();
    };

    const submitChanges = async (toUpdate: object) => {
        await updateUserInfo(toUpdate);

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
                            <button type='button' onClick={() => submitChanges(toUpdate)} disabled={useField.stringValue() === currentValue}>
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
                    <div>{currentValue}</div>
                    <div className='alignRight'>
                        <button type='button' onClick={() => setEditedInfo(info)}>
                            {contentToText(ContentID.miscChange, config)} {contentToText(buttonLabel, config)}
                        </button>
                    </div>
                </>
            )}
        </>
    );

    return (
        <div className='infoBox'>
            <div className='infoHeader'>{contentToText(ContentID.accountContactInfo, config)}</div>
            <div className='grid-container left' style={{ gap: '1em 2em', gridTemplateColumns: 'auto 1fr auto' }}>
                <div className='semiBold'>{contentToText(ContentID.contactEmail, config)}:</div>
                <div>{addLinkToEmail ? <a href={'mailto:' + user.username}>{user.username}</a> : <>{user.username}</>}</div>
                <div />

                <div className='semiBold'>{contentToText(ContentID.contactPhone, config)}:</div>
                {info('phone', phone, { contactPhone: phone.stringValue() }, user.contactPhone, ContentID.contactPhone)}

                <div className='semiBold'>{contentToText(ContentID.checkOutStreetAddress, config)}:</div>
                {info('address', address, { contactAddress: address.stringValue() }, user.contactAddress, ContentID.checkOutStreetAddress)}

                <div className='semiBold'>{contentToText(ContentID.checkOutZipCode, config)}:</div>
                {info('zipcode', zipcode, { contactZipCode: zipcode.stringValue() }, user.contactZipcode, ContentID.checkOutZipCode)}

                <div className='semiBold'>{contentToText(ContentID.checkOutCity, config)}:</div>
                {info('city', city, { contactCity: city.stringValue() }, user.contactCity, ContentID.checkOutCity)}

                <div className='semiBold'>{contentToText(ContentID.checkOutCountry, config)}:</div>
                <div>{user.contactCountry}</div>
                <div />
            </div>
        </div>
    );
};

export default UserContactInfo;

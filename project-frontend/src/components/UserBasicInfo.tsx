import { useState } from 'react';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import format from '../util/format';
import { contentToText } from '../types/languageFunctions';
import useField from '../hooks/useField';
import { getUserStatus } from '../util/userProvider';

import InputField from './InputField';

interface Props {
    addLinkToEmail?: boolean;
    config: Config;
    showUserStatus?: boolean;
    user: User;
}
const UserBasicInfo = ({ config, showUserStatus = false, user }: Props) => {
    const [editedInfo, setEditedInfo] = useState<'' | 'name'>('');

    const firstName = useField('text', null, user.contactFirstName);
    const lastName = useField('text', null, user.contactLastName);

    const cancelChanges = () => {
        setEditedInfo('');

        firstName.reset();
        lastName.reset();
    };

    const submitChanges = async () => {
        const editedUser: User = { ...user, contactFirstName: firstName.stringValue(), contactLastName: lastName.stringValue() };
        console.log('editedUser:', editedUser);

        setEditedInfo('');
    };

    return (
        <div className='infoBox'>
            <div className='grid-container' data-cols='2'>
                <div className='infoHeader'>{contentToText(ContentID.accountAccountInfo, config)}</div>
                {user.disabled && (
                    <div className='alignRight bold colorRed sizeLarge' style={{ marginTop: '-0.5em', textTransform: 'uppercase' }}>
                        {contentToText(ContentID.userDisabled, config)}
                    </div>
                )}
            </div>
            <div className='grid-container left' style={{ gap: '1em 2em', gridTemplateColumns: 'auto 1fr auto' }}>
                <div className='semiBold'>{contentToText(ContentID.miscName, config)}:</div>
                {editedInfo === 'name' ? (
                    <>
                        <div className='grid-container' style={{ gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <div className='grid-container' style={{ gap: '0.5rem' }}>
                                <div className='adminItemEditLabel'>{contentToText(ContentID.checkOutFirstName, config)}</div>
                                <InputField useField={firstName} width='100%' />
                            </div>
                            <div className='grid-container' style={{ gap: '0.5rem' }}>
                                <div className='adminItemEditLabel'>{contentToText(ContentID.checkOutLastName, config)}</div>
                                <InputField useField={lastName} width='100%' />
                            </div>
                        </div>
                        <div className='valignBottom'>
                            <div className='grid-container' data-cols='2' data-gap='1rem'>
                                <button type='button' onClick={submitChanges}>
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
                        <div>{user.contactFirstName + ' ' + user.contactLastName}</div>
                        <div className='alignRight'>
                            <button type='button' onClick={() => setEditedInfo('name')}>
                                {contentToText(ContentID.miscChange, config)} {contentToText(ContentID.miscName, config)}
                            </button>
                        </div>
                    </>
                )}
                {user.contactOrganization && user.contactOrganization.length > 0 && (
                    <>
                        <div className='semiBold'>{contentToText(ContentID.checkOutOrganization, config)}:</div>
                        <div>{user.contactOrganization}</div>
                        <div />
                    </>
                )}
                {showUserStatus && (
                    <>
                        <div className='semiBold'>Status:</div>
                        <div>{getUserStatus(user, config)}</div>
                        <div />
                    </>
                )}
                <div className='semiBold'>{contentToText(ContentID.accountUserId, config)}:</div>
                <div>{user.id}</div>
                <div />
                <div className='semiBold'>{contentToText(ContentID.userRegisteredDate, config)}:</div>
                <div>{format.dateFormat(new Date(user.createdAt))}</div>
                <div />
            </div>
        </div>
    );
};

export default UserBasicInfo;

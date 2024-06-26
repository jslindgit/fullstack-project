import { useState } from 'react';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { User } from '../../types/types';

import format from '../../util/format';
import { contentToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';
import { getUserStatus } from '../../util/userProvider';

import InputField from '../InputField';

interface Props {
    addLinkToEmail?: boolean;
    config: Config;
    showUserStatus?: boolean;
    updateUserInfo: ((toUpdate: object, propertyName: ContentID) => Promise<void>) | null;
    user: User;
}
const UserBasicInfo = ({ config, showUserStatus = false, updateUserInfo, user }: Props) => {
    const [editedInfo, setEditedInfo] = useState<'' | 'name' | 'organization'>('');

    const firstName = useField('text', null, user.contactFirstName);
    const lastName = useField('text', null, user.contactLastName);
    const organization = useField('text', null, user.contactOrganization ? user.contactOrganization : '');

    const cancelChanges = () => {
        setEditedInfo('');

        firstName.reset();
        lastName.reset();
        organization.reset();
    };

    const submitChanges = async (toUpdate: object, propertyName: ContentID) => {
        if (updateUserInfo) {
            await updateUserInfo(toUpdate, propertyName);
        }

        setEditedInfo('');
    };

    return (
        <div className='infoBox userInfo'>
            <div className='grid-container' data-cols='2'>
                <div className='infoHeader'>{contentToText(ContentID.accountAccountInfo, config)}</div>
                {user.disabled && (
                    <div className='alignRight bold colorRed marginTop-0_5 sizeLarge upperCase'>{contentToText(ContentID.userDisabled, config)}</div>
                )}
            </div>
            <div className='grid-container left size' data-cols='user-info' data-gap='1rem 2rem'>
                <div className='bold'>{contentToText(ContentID.miscName, config)}:</div>
                {editedInfo === 'name' ? (
                    <>
                        <div className='grid-container' data-cols='2' data-gap='1rem'>
                            <div className='grid-container' data-gap='0.5rem'>
                                <div className='adminItemEditLabel'>{contentToText(ContentID.checkOutFirstName, config)}</div>
                                <InputField useField={firstName} width='100%' autoFocus={true} />
                            </div>
                            <div className='grid-container' data-gap='0.5rem'>
                                <div className='adminItemEditLabel'>{contentToText(ContentID.checkOutLastName, config)}</div>
                                <InputField useField={lastName} width='100%' />
                            </div>
                        </div>
                        <div className='valignBottom'>
                            <div className='grid-container' data-cols='2' data-gap='1rem'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        submitChanges(
                                            { contactFirstName: firstName.stringValue(), contactLastName: lastName.stringValue() },
                                            ContentID.miscName
                                        )
                                    }
                                    disabled={firstName.stringValue() === user.contactFirstName && lastName.stringValue() === user.contactLastName}
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
                        <div>{user.contactFirstName + ' ' + user.contactLastName}</div>
                        {updateUserInfo ? (
                            <div className='alignRight'>
                                <button type='button' onClick={() => setEditedInfo('name')}>
                                    {contentToText(ContentID.miscChange, config)} {contentToText(ContentID.miscName, config)}
                                </button>
                            </div>
                        ) : (
                            <div />
                        )}
                    </>
                )}
                <div className='bold'>{contentToText(ContentID.checkOutOrganization, config)}:</div>
                {editedInfo === 'organization' ? (
                    <>
                        <div>
                            <InputField useField={organization} width='100%' autoFocus={true} />
                        </div>
                        <div>
                            <div className='grid-container' data-cols='2' data-gap='1rem'>
                                <button
                                    type='button'
                                    onClick={() => submitChanges({ contactOrganization: organization.stringValue() }, ContentID.miscName)}
                                    disabled={organization.stringValue() === user.contactOrganization}
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
                        <div>{user.contactOrganization}</div>
                        {updateUserInfo ? (
                            <div className='alignRight'>
                                <button type='button' onClick={() => setEditedInfo('organization')}>
                                    {contentToText(ContentID.miscChange, config)} {contentToText(ContentID.checkOutOrganization, config)}
                                </button>
                            </div>
                        ) : (
                            <div />
                        )}
                    </>
                )}
                {showUserStatus && (
                    <>
                        <div className='bold'>Status:</div>
                        <div>{getUserStatus(user, config)}</div>
                        <div />
                    </>
                )}
                <div className='bold'>{contentToText(ContentID.accountUserId, config)}:</div>
                <div>{user.id}</div>
                <div />
                <div className='bold'>{contentToText(ContentID.userRegisteredDate, config)}:</div>
                <div>{format.dateFormat(new Date(user.createdAt))}</div>
                <div />
            </div>
        </div>
    );
};

export default UserBasicInfo;

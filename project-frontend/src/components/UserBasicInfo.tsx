import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import format from '../util/format';
import { contentToText } from '../types/languageFunctions';
import { getUserStatus } from '../util/userProvider';

interface Props {
    addLinkToEmail?: boolean;
    config: Config;
    showUserStatus?: boolean;
    user: User;
}
const UserBasicInfo = ({ config, showUserStatus = false, user }: Props) => (
    <div className='infoBox'>
        <div className='grid-container' data-cols='2'>
            <div className='infoHeader'>{contentToText(ContentID.accountAccountInfo, config)}</div>
            {user.disabled && (
                <div className='alignRight bold colorRed sizeLarge' style={{ marginTop: '-0.5em', textTransform: 'uppercase' }}>
                    {contentToText(ContentID.userDisabled, config)}
                </div>
            )}
        </div>
        <div className='grid-container left' style={{ gap: '1em 2em', gridTemplateColumns: 'auto 1fr' }}>
            <div className='semiBold'>{contentToText(ContentID.miscName, config)}:</div>
            <div>{user.contactFirstName + ' ' + user.contactLastName}</div>
            {user.contactOrganization && user.contactOrganization.length > 0 && (
                <>
                    <div className='semiBold'>{contentToText(ContentID.checkOutOrganization, config)}:</div>
                    <div>{user.contactOrganization}</div>
                </>
            )}
            {showUserStatus && (
                <>
                    <div className='semiBold'>Status:</div>
                    <div>{getUserStatus(user, config)}</div>
                </>
            )}
            <div className='semiBold'>{contentToText(ContentID.accountUserId, config)}:</div>
            <div>{user.id}</div>
            <div className='semiBold'>{contentToText(ContentID.userRegisteredDate, config)}:</div>
            <div>{format.dateFormat(new Date(user.createdAt))}</div>
        </div>
    </div>
);

export default UserBasicInfo;

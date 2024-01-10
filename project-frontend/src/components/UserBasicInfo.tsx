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
    width: number;
}
const UserBasicInfo = ({ addLinkToEmail = false, config, showUserStatus = false, user, width }: Props) => {
    return (
        <table align='center' width={width} className='infoBox'>
            <tbody>
                <tr>
                    <td colSpan={user.disabled ? 1 : 2} className='widthByContent'>
                        <div className='infoHeader underlined'>{contentToText(ContentID.accountAccountInfo, config)}</div>
                    </td>
                    {user.disabled ? <td className='alignRight bold colorRed sizeLarge upperCase'>{contentToText(ContentID.userDisabled, config)}</td> : <></>}
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.miscName, config)}:&emsp;</td>
                    <td>{user.contactFirstName + ' ' + user.contactLastName}</td>
                </tr>
                {user.contactOrganization && user.contactOrganization.length > 0 ? (
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.checkOutOrganization, config)}:&emsp;</td>
                        <td>{user.contactOrganization}</td>
                    </tr>
                ) : (
                    ''
                )}
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.contactEmail, config)}:&emsp;</td>
                    <td>{addLinkToEmail ? <a href={'mailto:' + user.username}>{user.username}</a> : <>{user.username}</>}</td>
                </tr>
                {showUserStatus ? (
                    <tr>
                        <td className='semiBold widthByContent'>Status:&emsp;</td>
                        <td>{getUserStatus(user, config)}</td>
                    </tr>
                ) : (
                    <></>
                )}
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.accountUserId, config)}:&emsp;</td>
                    <td>{user.id}</td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.userRegisteredDate, config)}:&emsp;</td>
                    <td>{format.dateFormat(new Date(user.createdAt))}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default UserBasicInfo;

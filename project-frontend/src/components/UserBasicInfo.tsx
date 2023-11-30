import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';

interface Props {
    config: Config;
    user: User;
    width: number;
}
const UserBasicInfo = ({ config, user, width }: Props) => {
    return (
        <table align='center' width={width} className='infoBox'>
            <tbody>
                <tr>
                    <td colSpan={2}>
                        <div className='infoHeader underlined'>{contentToText(ContentID.accountAccountInfo, config)}</div>
                    </td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.miscName, config)}:&emsp;</td>
                    <td>
                        {user.contactFirstName + ' ' + user.contactLastName}
                        {user.admin ? <span className='bold'> ({contentToText(ContentID.menuAdmin, config)})</span> : <></>}
                    </td>
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
                    <td>{user.username}</td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.accountUserId, config)}:&emsp;</td>
                    <td>{user.id}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default UserBasicInfo;

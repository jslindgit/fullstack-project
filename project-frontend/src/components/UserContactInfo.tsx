import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';

interface Props {
    config: Config;
    user: User;
    width: number;
}
const UserContactInfo = ({ config, user, width }: Props) => {
    return (
        <table align='center' width={width} className='infoBox'>
            <tbody>
                <tr>
                    <td colSpan={2}>
                        <div className='infoHeader underlined'>{contentToText(ContentID.accountContactInfo, config)}</div>
                    </td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.contactPhone, config)}:&emsp;</td>
                    <td>{user.contactPhone}</td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.checkOutStreetAddress, config)}:&emsp;</td>
                    <td>{user.contactAddress}</td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.checkOutZipCode, config)}:&emsp;</td>
                    <td>{user.contactZipcode}</td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.checkOutCity, config)}:&emsp;</td>
                    <td>{user.contactCity}</td>
                </tr>
                <tr>
                    <td className='semiBold widthByContent'>{contentToText(ContentID.checkOutCountry, config)}:&emsp;</td>
                    <td>{user.contactCountry}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default UserContactInfo;

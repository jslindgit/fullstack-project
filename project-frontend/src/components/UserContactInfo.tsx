import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';

interface Props {
    addLinkToEmail?: boolean;
    config: Config;
    user: User;
}
const UserContactInfo = ({ addLinkToEmail = false, config, user }: Props) => (
    <div className='infoBox'>
        <div className='infoHeader'>{contentToText(ContentID.accountContactInfo, config)}</div>
        <div className='grid-container left' style={{ gap: '1em 2em', gridTemplateColumns: 'auto 1fr' }}>
            <div className='semiBold'>{contentToText(ContentID.contactEmail, config)}:</div>
            <div>{addLinkToEmail ? <a href={'mailto:' + user.username}>{user.username}</a> : <>{user.username}</>}</div>
            <div className='semiBold'>{contentToText(ContentID.contactPhone, config)}:</div>
            <div>{user.contactPhone}</div>
            <div className='semiBold'>{contentToText(ContentID.checkOutStreetAddress, config)}:</div>
            <div>{user.contactAddress}</div>
            <div className='semiBold'>{contentToText(ContentID.checkOutZipCode, config)}:</div>
            <div>{user.contactZipcode}</div>
            <div className='semiBold'>{contentToText(ContentID.checkOutCity, config)}:</div>
            <div>{user.contactCity}</div>
            <div className='semiBold'>{contentToText(ContentID.checkOutCountry, config)}:</div>
            <div>{user.contactCountry}</div>
        </div>
    </div>
);

export default UserContactInfo;

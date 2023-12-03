import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { User } from '../types/types';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';

import UserBasicInfo from './UserBasicInfo';
import UserChangePassword from './UserChangePassword';
import UserContactInfo from './UserContactInfo';
import UserOrderHistory from './UserOrderHistory';

const UserPanel = () => {
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.user);

    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        setUser(usersState.loggedUser);

        if (miscState.loaded && (!usersState.loggedUser || usersState.loggedUser === null)) {
            navigate('/login');
        }
    }, [usersState.loggedUser, miscState.loaded, navigate, user]);

    if (!user) {
        return <>{contentToText(ContentID.menuLogin, config)}</>;
    }

    return (
        <>
            <table align='center' width={pageWidth} className='valignTop'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.menuAccount, config)}</td>
                    </tr>
                </tbody>
            </table>
            <UserBasicInfo config={config} user={user} width={pageWidth} />
            <br />
            <UserContactInfo config={config} user={user} width={pageWidth} />
            <br />
            <UserChangePassword config={config} user={user} width={pageWidth} />
            <br />
            <UserOrderHistory config={config} user={user} width={pageWidth} />
            <br />
        </>
    );
};

export default UserPanel;

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { User } from '../types/types';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';

import { initializeLoggedUser } from '../reducers/userReducer';

import UserBasicInfo from './UserBasicInfo';
import UserChangePassword from './UserChangePassword';
import UserContactInfo from './UserContactInfo';
import UserDeleteAccount from './UserDeleteAccount';
import UserOrderHistory from './UserOrderHistory';

const UserPanel = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.user);

    const [user, setUser] = useState<User | null>(null);
    const [userInitialized, setUserInitialized] = useState<boolean>(false);

    const navigate = useNavigate();

    // Fetch the loggedUser from the server (with 'initializeLoggedUser') to make sure it's up to date:
    useEffect(() => {
        document.title = contentToText(ContentID.menuAccount, config) + ' | ' + config.store.contactName;

        const init = async () => {
            await initializeLoggedUser(dispatch);
            setUserInitialized(true);
        };

        init();
    }, [config, dispatch]);

    useEffect(() => {
        setUser(usersState.loggedUser);

        if (miscState.loaded && userInitialized && (!usersState.loggedUser || usersState.loggedUser === null)) {
            navigate('/login');
        }
    }, [usersState.loggedUser, miscState.loaded, navigate, user, userInitialized]);

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
            <UserBasicInfo config={config} showUserStatus={user.admin || user.operator} user={user} width={pageWidth} />
            <br />
            <UserContactInfo config={config} user={user} width={pageWidth} />
            <br />
            <UserChangePassword config={config} user={user} width={pageWidth} />
            <br />
            <UserOrderHistory config={config} user={user} width={pageWidth} />
            <br />
            <UserDeleteAccount config={config} user={user} width={pageWidth} />
            <br />
            <br />
        </>
    );
};

export default UserPanel;

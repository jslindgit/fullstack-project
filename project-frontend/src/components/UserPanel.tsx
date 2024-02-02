import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { User } from '../types/types';

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
        <div className='pageWidth'>
            <div data-testid='account-header' className='pageHeader'>
                {contentToText(ContentID.menuAccount, config)}
            </div>
            <div className='grid-container' data-gap='2rem' style={{ marginBottom: '2rem' }}>
                <UserBasicInfo config={config} showUserStatus={user.admin || user.operator} user={user} />
                <UserContactInfo config={config} user={user} />
                <UserChangePassword config={config} user={user} />
                <UserOrderHistory config={config} user={user} />
                <UserDeleteAccount config={config} user={user} />
            </div>
        </div>
    );
};

export default UserPanel;

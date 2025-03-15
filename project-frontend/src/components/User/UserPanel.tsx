import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';
import { User } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';

import { setNotification } from '../../redux/miscReducer';
import { useSettingsGetQuery } from '../../redux/slices/settingsSlice';
import store from '../../redux/store';
import { initializeLoggedUser } from '../../redux/userReducer';
import { useUserUpdateMutation } from '../../redux/slices/userSlice';

import UserBasicInfo from './UserBasicInfo';
import UserChangePassword from './UserChangePassword';
import UserContactInfo from './UserContactInfo';
import UserDeleteAccount from './UserDeleteAccount';
import UserOrderHistory from './UserOrderHistory';

const UserPanel = () => {
    const settingsGet = useSettingsGetQuery();
    const [userUpdate] = useUserUpdateMutation();

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.user);

    const [user, setUser] = useState<User | null>(null);
    const [userInitialized, setUserInitialized] = useState<boolean>(false);

    const navigate = useNavigate();

    // Fetch the loggedUser from the server (with 'initializeLoggedUser') to make sure it's up to date:
    useEffect(() => {
        document.title = settingsGet.data ? contentToText(ContentID.menuAccount, config) + ' | ' + settingsGet.data.storeName : '';

        const init = async () => {
            await initializeLoggedUser(dispatch, store.dispatch);
            setUserInitialized(true);
        };

        init();
    }, [config, dispatch, settingsGet.data, user]);

    useEffect(() => {
        if (user?.id !== usersState.loggedUser?.id) {
            setUser(usersState.loggedUser);
        }

        if (miscState.loaded && userInitialized && (!usersState.loggedUser || usersState.loggedUser === null)) {
            navigate('/login');
        }
    }, [usersState.loggedUser, miscState.loaded, navigate, user, userInitialized]);

    if (!user) {
        return <>{contentToText(ContentID.menuLogin, config)}</>;
    }

    const updateUserInfo = async (toUpdate: object, propertyName: ContentID) => {
        if (usersState.loggedUser) {
            const res = await userUpdate({ userId: user.id, propsToUpdate: toUpdate, propertyName: propertyName, config: config }).unwrap();

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

            if (res.user) {
                setUser(res.user);
            }
        }
    };

    return (
        <div className='pageWidth'>
            <div data-testid='account-header' className='pageHeader'>
                {contentToText(ContentID.menuAccount, config)}
            </div>
            <div className='grid-container marginBottom2' data-gap='2rem'>
                <UserBasicInfo config={config} showUserStatus={user.admin || user.operator} updateUserInfo={updateUserInfo} user={user} />
                <UserContactInfo config={config} updateUserInfo={updateUserInfo} user={user} />
                <UserChangePassword config={config} user={user} />
                <UserOrderHistory config={config} user={user} />
                <UserDeleteAccount config={config} user={user} />
            </div>
        </div>
    );
};

export default UserPanel;

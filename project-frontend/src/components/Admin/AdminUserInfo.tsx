import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { User } from '../../types/types';

import { pageWidth } from '../../constants';
import { contentToText } from '../../types/languageFunctions';
import userService from '../../services/userService';

import { setNotification } from '../../reducers/miscReducer';

import BackButton from '../BackButton';
import UserBasicInfo from '../UserBasicInfo';
import UserContactInfo from '../UserContactInfo';
import UserOrderHistory from '../UserOrderHistory';

const AdminUserInfo = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.users);

    const [fetched, setFetched] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const id = Number(useParams().id);

    useEffect(() => {
        setFetched(true);
        const fetch = async () => {
            const fetchedUser = await userService.getById(id);
            if (fetchedUser) {
                setUser(fetchedUser);
            }
        };

        fetch();
    }, [id]);

    const handleDeleteAccount = () => {
        if (window.confirm(contentToText(ContentID.adminUserInfoDeleteAccount, config))) {
            console.log('delete...');
        }
    };

    const handleDisableOrEnableAccount = async () => {
        if (user && usersState.loggedUser) {
            if (window.confirm(contentToText(user.disabled ? ContentID.adminUserInfoEnableAccount : ContentID.adminUserInfoDisableAccount, config))) {
                const response = await userService.update({ ...user, disabled: !user.disabled }, usersState.loggedUser.token, config);
                dispatch(setNotification({ message: response.message, tone: response.success ? 'Positive' : 'Negative' }));
                setUser(response.user);
            }
        } else {
            console.log('user:', user);
            console.log('usersState.loggedUser:', usersState.loggedUser);
        }
    };

    if (!user) {
        return <>{contentToText(ContentID.menuLogin, config)}</>;
    }

    if (!user) {
        return <div className='semiBold sizeLarge'>{fetched ? 'Something went wrong :(' : 'Loading...'}</div>;
    }

    return (
        <>
            <table align='center' width={pageWidth} className='valignTop'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.adminUserInfoHeader, config)}</td>
                        <td className='alignRight'>
                            <BackButton type='button' />
                        </td>
                    </tr>
                </tbody>
            </table>
            <UserBasicInfo addLinkToEmail={true} config={config} showUserStatus={true} user={user} width={pageWidth} />
            <br />
            <br />
            <UserContactInfo config={config} user={user} width={pageWidth} />
            <br />
            <br />
            <UserOrderHistory config={config} user={user} width={pageWidth} />
            <br />
            <br />
            <table align='center' width={pageWidth} className='infoBox'>
                <tbody>
                    <tr>
                        <td>
                            <a href={'mailto:' + user.username}>
                                <button type='button'>{contentToText(ContentID.adminUserInfoSendMessage, config)}</button>
                            </a>
                            &emsp;
                            <button type='button'>{contentToText(ContentID.adminUserInfoChangeStatus, config)}</button>
                            &emsp;
                            {user.disabled ? (
                                <button type='button' onClick={handleDisableOrEnableAccount}>
                                    {contentToText(ContentID.buttonEnable, config)} {contentToText(ContentID.menuAccount, config)}
                                </button>
                            ) : (
                                <button type='button' className='red' onClick={handleDisableOrEnableAccount}>
                                    {contentToText(ContentID.buttonDisable, config)} {contentToText(ContentID.menuAccount, config)}
                                </button>
                            )}
                        </td>
                        <td className='alignRight'>
                            &emsp;
                            <button type='button' className='red' onClick={handleDeleteAccount}>
                                {contentToText(ContentID.buttonRemove, config)} {contentToText(ContentID.menuAccount, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='button' />
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
        </>
    );
};

export default AdminUserInfo;

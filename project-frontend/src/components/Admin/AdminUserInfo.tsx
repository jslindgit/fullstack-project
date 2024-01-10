import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { User } from '../../types/types';

import { pageWidth } from '../../constants';
import { contentToText } from '../../types/languageFunctions';
import { getUserStatus } from '../../util/userProvider';
import userService from '../../services/userService';

import { setNotification } from '../../reducers/miscReducer';

import BackButton from '../BackButton';
import UserBasicInfo from '../UserBasicInfo';
import UserContactInfo from '../UserContactInfo';
import UserOrderHistory from '../UserOrderHistory';

const AdminUserInfo = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [fetched, setFetched] = useState<boolean>(false);
    const [newStatus, setNewStatus] = useState<string>('customer');
    const [showStatusChange, setShowStatusChange] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const id = Number(useParams().id);

    // Fetch User by the URL param:
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

    // Set the initial value of 'newStatus':
    useEffect(() => {
        if (user) {
            setNewStatus(user.admin || user.operator ? 'operator' : 'customer');
        }
    }, [user]);

    const handleDeleteAccount = async () => {
        if (user && usersState.loggedUser?.admin) {
            if (window.confirm(contentToText(ContentID.adminUserInfoDeleteAccount, config))) {
                const res = await userService.deleteUser(user, usersState.loggedUser.token, config);

                dispatch(setNotification({ message: res.message, tone: res.success ? 'Neutral' : 'Negative' }));

                navigate('/admin/users');
            }
        } else {
            window.alert(contentToText(ContentID.errorThisOperationRequiresAdminRights, config));
        }
    };

    const handleDisableOrEnableAccount = async () => {
        if (user && usersState.loggedUser) {
            if (window.confirm(contentToText(user.disabled ? ContentID.adminUserInfoEnableAccount : ContentID.adminUserInfoDisableAccount, config))) {
                const response = await userService.update(user.id, { disabled: !user.disabled }, usersState.loggedUser.token, config);
                dispatch(setNotification({ message: response.message, tone: response.success ? 'Positive' : 'Negative' }));
                setUser(response.user);
            }
        }
    };

    const handleSaveStatus = async () => {
        if (user && usersState.loggedUser?.admin) {
            if ((newStatus === 'customer' && user.operator) || (newStatus === 'operator' && !user.operator)) {
                const res = await userService.update(user.id, { operator: newStatus === 'operator' }, usersState.loggedUser.token, config);

                if (res.user) {
                    setUser(res.user);
                }

                dispatch(setNotification({ message: res.message, tone: res.success ? 'Positive' : 'Negative' }));
            }
        } else {
            window.alert(contentToText(ContentID.errorThisOperationRequiresAdminRights, config));
        }
    };

    if (!user) {
        return <div className='semiBold sizeLarge'>{fetched ? 'Something went wrong :(' : 'Loading...'}</div>;
    }

    return (
        <>
            <table align='center' width={pageWidth} className='valignTop'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.adminUserInfoHeader, config)}</td>
                        <td className='alignRight' style={{ paddingTop: '1.5rem' }}>
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
                            <button
                                type='button'
                                onClick={() => setShowStatusChange(!showStatusChange)}
                                disabled={user.admin || !usersState.loggedUser?.admin}
                                title={!usersState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''}
                            >
                                {contentToText(ContentID.adminUserInfoChangeStatus, config)}
                            </button>
                            &emsp;
                            <button
                                type='button'
                                className='red'
                                onClick={handleDisableOrEnableAccount}
                                disabled={user.admin || (user.operator && !usersState.loggedUser?.admin)}
                                title={
                                    user.operator && !usersState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''
                                }
                            >
                                {contentToText(
                                    user.disabled ? ContentID.adminUserInfoEnableAccountButton : ContentID.adminUserInfoDisableAccountButton,
                                    config
                                )}
                            </button>
                        </td>
                        <td className='alignRight'>
                            &emsp;
                            <button
                                type='button'
                                className='red'
                                disabled={user.admin || !usersState.loggedUser?.admin}
                                onClick={handleDeleteAccount}
                                title={!usersState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''}
                            >
                                {contentToText(ContentID.adminUserInfoDeleteAccountButton, config)}
                            </button>
                        </td>
                    </tr>
                    {showStatusChange ? (
                        <tr>
                            <td colSpan={2}>
                                <table className='infoBox' style={{ marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className='semiBold sizeLarge' style={{ paddingLeft: 0 }}>
                                                {user.contactFirstName} {user.contactLastName}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingLeft: 0 }}>
                                                {contentToText(ContentID.miscCurrent, config)} {contentToText(ContentID.userStatusHeader, config).toLowerCase()}
                                                :
                                            </td>
                                            <td colSpan={2} className='semiBold'>
                                                {getUserStatus(user, config)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingLeft: 0 }}>
                                                {contentToText(ContentID.orderStatusForAdminNew, config)}{' '}
                                                {contentToText(ContentID.userStatusHeader, config).toLowerCase()}:
                                            </td>
                                            <td>
                                                <select
                                                    value={newStatus}
                                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setNewStatus(event.target.value)}
                                                >
                                                    <option value='customer'>{contentToText(ContentID.userStatusCustomer, config)}</option>
                                                    <option value='operator'>{contentToText(ContentID.userStatusOperator, config)}</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    type='button'
                                                    onClick={handleSaveStatus}
                                                    disabled={!((newStatus === 'customer' && user.operator) || (newStatus === 'operator' && !user.operator))}
                                                >
                                                    {contentToText(ContentID.buttonSave, config)}
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    ) : (
                        ''
                    )}
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

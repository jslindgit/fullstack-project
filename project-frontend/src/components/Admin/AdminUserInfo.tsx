import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { User } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';
import { getUserStatus } from '../../util/userProvider';
import userService from '../../services/userService';

import { setNotification } from '../../reducers/miscReducer';

import BackButton from '../BackButton';
import UserBasicInfo from '../User/UserBasicInfo';
import UserContactInfo from '../User/UserContactInfo';
import UserOrderHistory from '../User/UserOrderHistory';

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
        <div className='pageWidth'>
            <div className='grid-container' data-cols='2'>
                <div className='pageHeader'>{contentToText(ContentID.adminUserInfoHeader, config)}</div>
                <div className='alignRight valignMiddle'>
                    <BackButton type='button' />
                </div>
            </div>
            <div className='grid-container' data-gap='2rem'>
                <UserBasicInfo addLinkToEmail={true} config={config} showUserStatus={true} updateUserInfo={null} user={user} />
                <UserContactInfo addLinkToEmail={true} config={config} updateUserInfo={null} user={user} />
                <UserOrderHistory config={config} user={user} />
                <div className='infoBox'>
                    <div className='grid-container' data-gap='1rem' style={{ gridTemplateColumns: 'auto auto auto 1fr' }}>
                        <div>
                            <a href={'mailto:' + user.username}>
                                <button type='button'>{contentToText(ContentID.adminUserInfoSendMessage, config)}</button>
                            </a>
                        </div>
                        <div>
                            <button
                                type='button'
                                onClick={() => setShowStatusChange(!showStatusChange)}
                                disabled={user.admin || !usersState.loggedUser?.admin}
                                title={!usersState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''}
                            >
                                {contentToText(ContentID.adminUserInfoChangeStatus, config)}
                            </button>
                        </div>
                        <div>
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
                        </div>
                        <div className='alignRight'>
                            <button
                                type='button'
                                className='red'
                                disabled={user.admin || !usersState.loggedUser?.admin}
                                onClick={handleDeleteAccount}
                                title={!usersState.loggedUser?.admin ? contentToText(ContentID.errorThisOperationRequiresAdminRights, config) : ''}
                            >
                                {contentToText(ContentID.adminUserInfoDeleteAccountButton, config)}
                            </button>
                        </div>
                    </div>
                    {showStatusChange && (
                        <div className='infoBox' style={{ marginTop: '1rem', width: 'min-content' }}>
                            <div className='alignLeft semiBold sizeLarge'>
                                {user.contactFirstName} {user.contactLastName}
                            </div>
                            <div className='grid-container left' style={{ gap: '1rem 2rem', gridTemplateColumns: 'auto auto 1fr', marginTop: '1rem' }}>
                                <div className='noWrap'>
                                    {contentToText(ContentID.miscCurrent, config)} {contentToText(ContentID.userStatusHeader, config).toLowerCase()}:
                                </div>
                                <div className='semiBold'>{getUserStatus(user, config)}</div>
                                <div />
                                <div className='noWrap'>
                                    {contentToText(ContentID.orderStatusForAdminNew, config)} {contentToText(ContentID.userStatusHeader, config).toLowerCase()}:
                                </div>
                                <div>
                                    <select value={newStatus} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setNewStatus(event.target.value)}>
                                        <option value='customer'>{contentToText(ContentID.userStatusCustomer, config)}</option>
                                        <option value='operator'>{contentToText(ContentID.userStatusOperator, config)}</option>
                                    </select>
                                </div>
                                <div>
                                    <button
                                        type='button'
                                        onClick={handleSaveStatus}
                                        disabled={!((newStatus === 'customer' && user.operator) || (newStatus === 'operator' && !user.operator))}
                                    >
                                        {contentToText(ContentID.buttonSave, config)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='alignLeft'>
                    <BackButton type='button' />
                </div>
            </div>
            <br />
        </div>
    );
};

export default AdminUserInfo;

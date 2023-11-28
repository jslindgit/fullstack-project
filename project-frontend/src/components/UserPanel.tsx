import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { User } from '../types/types';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';
import loginService from '../services/loginService';
import useField, { UseField } from '../hooks/useField';

import { setNotification } from '../reducers/miscReducer';

const UserPanel = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.users);

    const [newPasswordError, setNewPasswordError] = useState<string>('');
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const passwordCurrent = useField('password');
    const passwordNew = useField('password');
    const passwordNewConfirm = useField('password');

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

    const handleCancelButton = () => {
        passwordCurrent.reset();
        passwordNew.reset();
        passwordNewConfirm.reset();
        setShowPasswordFields(false);
    };

    const handleSubmitPasswordChange = async () => {
        if (passwordNew.value.toString().length < 10) {
            setNewPasswordError(contentToText(ContentID.loginNewPasswordTooShort, config));
        } else if (passwordNew.value !== passwordNewConfirm.value) {
            setNewPasswordError(contentToText(ContentID.loginNewPasswordMisMatch, config));
        } else {
            setNewPasswordError('');
            const response = await loginService.changePassword(user.username, passwordCurrent.value.toString(), passwordNew.value.toString(), config);
            dispatch(setNotification({ tone: response.success ? 'Positive' : 'Negative', message: response.message }));
        }
    };

    const passwordField = (label: string, field: UseField, error: boolean = false) => (
        <tr>
            <td className='widthByContent' style={{ paddingLeft: 0 }}>
                {label}:
            </td>
            <td>
                <input
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    className={error ? 'error' : ''}
                    style={{ maxWidth: '32rem', width: '100%' }}
                />
            </td>
        </tr>
    );

    return (
        <>
            <table align='center' width={pageWidth} className='valignTop'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.menuAccount, config)}</td>
                    </tr>
                    <tr>
                        <td className='infoBox'>
                            <table width='100%'>
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
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                            {showPasswordFields ? (
                                                <table width='100%' className='valignMiddleImportant'>
                                                    <tbody>
                                                        {passwordField(contentToText(ContentID.accountPasswordCurrent, config), passwordCurrent)}
                                                        {passwordField(
                                                            contentToText(ContentID.accountPasswordNew, config),
                                                            passwordNew,
                                                            newPasswordError.length > 0
                                                        )}
                                                        {passwordField(
                                                            contentToText(ContentID.accountPasswordNewConfirm, config),
                                                            passwordNewConfirm,
                                                            newPasswordError.length > 0
                                                        )}
                                                        {newPasswordError.length > 0 ? (
                                                            <tr>
                                                                <td></td>
                                                                <td className='colorRed semiBold'>{newPasswordError}</td>
                                                            </tr>
                                                        ) : (
                                                            ''
                                                        )}
                                                        <tr>
                                                            <td></td>
                                                            <td style={{ paddingTop: '1rem' }}>
                                                                <button type='button' onClick={handleSubmitPasswordChange}>
                                                                    {contentToText(ContentID.accountButtonChangePassword, config)}
                                                                </button>
                                                                &emsp;&emsp;
                                                                <button type='button' onClick={handleCancelButton}>
                                                                    {contentToText(ContentID.buttonCancel, config)}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <a onClick={() => setShowPasswordFields(true)}>{contentToText(ContentID.accountChangePassword, config)}</a>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='infoBox'>
                            <table width='100%'>
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
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='infoBox'>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className='infoHeader underlined'>{contentToText(ContentID.accountOrderHistory, config)}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table className='headerRow striped'>
                                                <tbody>
                                                    <tr>
                                                        <td>{contentToText(ContentID.miscDate, config)}&emsp;&emsp;</td>
                                                        <td>{contentToText(ContentID.orderId, config)}&emsp;&emsp;</td>
                                                        <td>{contentToText(ContentID.orderItems, config)}&emsp;&emsp;</td>
                                                        <td>{contentToText(ContentID.orderTotalAmount, config)}</td>
                                                        <td>{contentToText(ContentID.orderStatus, config)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
        </>
    );
};

export default UserPanel;

import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';
import loginService from '../services/loginService';
import { isValidPassword } from '../util/misc';
import useField, { UseField } from '../hooks/useField';

import { setNotification } from '../reducers/miscReducer';

interface Props {
    config: Config;
    user: User;
    width: number;
}
const UserChangePassword = ({ config, user, width }: Props) => {
    const dispatch = useDispatch();

    const [newPasswordError, setNewPasswordError] = useState<string>('');
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);

    const passwordCurrent = useField('password', null);
    const passwordNew = useField('password', null);
    const passwordNewConfirm = useField('password', null);

    const handleCancelButton = () => {
        passwordCurrent.reset();
        passwordNew.reset();
        passwordNewConfirm.reset();
        setShowPasswordFields(false);
    };

    const handleSubmitPasswordChange = async () => {
        if (!isValidPassword(passwordNew.value.toString())) {
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
        <table align='center' width={width} className='infoBox'>
            <tbody>
                <tr>
                    <td>
                        {showPasswordFields ? (
                            <table width='100%' className='valignMiddleImportant'>
                                <tbody>
                                    {passwordField(contentToText(ContentID.accountPasswordCurrent, config), passwordCurrent)}
                                    {passwordField(contentToText(ContentID.accountPasswordNew, config), passwordNew, newPasswordError.length > 0)}
                                    {passwordField(contentToText(ContentID.accountPasswordNewConfirm, config), passwordNewConfirm, newPasswordError.length > 0)}
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
                                                {contentToText(ContentID.buttonSubmit, config)}
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
                            <a className='sizeLarge' onClick={() => setShowPasswordFields(true)}>
                                {contentToText(ContentID.accountChangePassword, config)}
                            </a>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default UserChangePassword;

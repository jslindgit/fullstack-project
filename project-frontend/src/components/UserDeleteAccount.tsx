import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';
import loginService from '../services/loginService';
import useField from '../hooks/useField';
import userService from '../services/userService';

import { setNotification } from '../reducers/miscReducer';
import { removeLoggedUser } from '../reducers/userReducer';

import InputField from './InputField';

interface Props {
    config: Config;
    user: User;
    width: number;
}
const UserDeleteAccount = ({ config, user, width }: Props) => {
    const dispatch = useDispatch();

    const [showPasswordField, setShowPasswordField] = useState<boolean>(false);

    const password = useField('password', null);

    const handleCancelButton = () => {
        password.reset();
        setShowPasswordField(false);
    };

    const handleDeleteAccount = async () => {
        // Check that the password is correct:
        const loginResponse = await loginService.checkPassword(user.username, password.value.toString(), config);

        if (loginResponse.success) {
            const res = await userService.deleteUser(user, user.token, config);

            if (res.success) {
                dispatch(removeLoggedUser());
            }

            dispatch(setNotification({ message: res.message, tone: res.success ? 'Neutral' : 'Negative' }));
        } else {
            password.reset();
            dispatch(setNotification({ message: loginResponse.message, tone: 'Negative' }));
        }
    };

    return (
        <table align='center' width={width} className='infoBox red'>
            <tbody>
                <tr>
                    <td>
                        {showPasswordField ? (
                            <table width='100%' className='valignMiddleImportant'>
                                <tbody>
                                    <tr>
                                        <td className='colorRed semiBold'>{contentToText(ContentID.accountDeleteAccountConfirm, config)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingBottom: '1.75rem', paddingTop: '1.5rem' }}>
                                            <InputField placeHolder={contentToText(ContentID.loginPassword, config)} useField={password} width='30rem' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button type='button' className='red' onClick={handleDeleteAccount} disabled={password.value.toString().length < 1}>
                                                {contentToText(ContentID.accountDeleteAccount, config)}
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
                            <a className='red sizeLarge' onClick={() => setShowPasswordField(true)}>
                                {contentToText(ContentID.accountDeleteAccount, config)}
                            </a>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default UserDeleteAccount;

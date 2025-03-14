import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { isResponse, User } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';
import { isValidPassword } from '../../util/misc';
import useField from '../../hooks/useField';

import { useChangePasswordMutation } from '../../redux/slices/loginSlice';
import { setNotification } from '../../redux/miscReducer';

import InputField from '../InputField';

interface Props {
    config: Config;
    user: User;
}
const UserChangePassword = ({ config, user }: Props) => {
    const [changePassword] = useChangePasswordMutation();

    const dispatch = useDispatch();

    const [currentPasswordError, setCurrentPasswordError] = useState<string>('');
    const [newPasswordError, setNewPasswordError] = useState<string>('');
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);

    const passwordCurrent = useField('password', null);
    const passwordNew = useField('password', null);
    const passwordNewConfirm = useField('password', null);

    useEffect(() => {
        setNewPasswordError('');
    }, [passwordNew.value, passwordNewConfirm.value]);

    useEffect(() => {
        setCurrentPasswordError('');
    }, [passwordCurrent.value]);

    const handleCancelButton = () => {
        passwordCurrent.clear();
        passwordNew.clear();
        passwordNewConfirm.clear();
        setShowPasswordFields(false);
    };

    const handleSubmitPasswordChange = async () => {
        if (!isValidPassword(passwordNew.value.toString())) {
            setNewPasswordError(contentToText(ContentID.loginNewPasswordTooShort, config));
        } else if (passwordNew.value !== passwordNewConfirm.value) {
            setNewPasswordError(contentToText(ContentID.loginNewPasswordMisMatch, config));
        } else {
            setNewPasswordError('');

            try {
                const res = await changePassword({
                    username: user.username,
                    currentPassword: passwordCurrent.value.toString(),
                    newPassword: passwordNew.stringValue(),
                    config: config,
                }).unwrap();

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

                passwordCurrent.clear();
                passwordNew.clear();
                passwordNewConfirm.clear();
                setShowPasswordFields(false);
            } catch (err) {
                if (isResponse(err)) {
                    if (err.status === 401) {
                        setCurrentPasswordError(err.message);
                    } else {
                        dispatch(setNotification({ tone: 'Negative', message: err.message }));
                    }
                }
            }
        }
    };

    return (
        <div className='alignLeft infoBox'>
            {showPasswordFields ? (
                <div className='grid-container' data-gap='2rem'>
                    <div className='grid-container left' data-cols='auto 1fr' data-gap='1rem 2rem'>
                        <div className='semiBold'>{contentToText(ContentID.accountPasswordCurrent, config)}:</div>
                        <div>
                            <InputField useField={passwordCurrent} width='32rem' className={currentPasswordError.length > 0 ? 'error' : ''} />
                        </div>
                        {currentPasswordError.length > 0 && (
                            <>
                                <div />
                                <div className='colorRed semiBold'>{currentPasswordError}</div>
                            </>
                        )}
                        <div className='semiBold'>{contentToText(ContentID.accountPasswordNew, config)}</div>
                        <div>
                            <InputField useField={passwordNew} width='32rem' className={newPasswordError.length > 0 ? ' error' : ''} />
                        </div>
                        <div className='semiBold'>{contentToText(ContentID.accountPasswordNewConfirm, config)}</div>
                        <div>
                            <InputField useField={passwordNewConfirm} width='32rem' className={newPasswordError.length > 0 ? ' error' : ''} />
                        </div>
                        {newPasswordError.length > 0 && (
                            <>
                                <div />
                                <div className='colorRed semiBold'>{newPasswordError}</div>
                            </>
                        )}
                    </div>
                    <div>
                        <button type='button' onClick={handleSubmitPasswordChange}>
                            {contentToText(ContentID.buttonSubmit, config)}
                        </button>
                        &emsp;&emsp;
                        <button type='button' onClick={handleCancelButton}>
                            {contentToText(ContentID.buttonCancel, config)}
                        </button>
                    </div>
                </div>
            ) : (
                <a className='sizeLarge' onClick={() => setShowPasswordFields(true)}>
                    <div className='alignCenter'>{contentToText(ContentID.accountChangePassword, config)}</div>
                </a>
            )}
        </div>
    );
};

export default UserChangePassword;

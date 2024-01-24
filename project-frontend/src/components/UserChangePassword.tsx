import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';
import loginService from '../services/loginService';
import { isValidPassword } from '../util/misc';
import useField from '../hooks/useField';

import { setNotification } from '../reducers/miscReducer';

import InputField from './InputField';

interface Props {
    config: Config;
    user: User;
}
const UserChangePassword = ({ config, user }: Props) => {
    const dispatch = useDispatch();

    const [newPasswordError, setNewPasswordError] = useState<string>('');
    const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);

    const passwordCurrent = useField('password', null);
    const passwordNew = useField('password', null);
    const passwordNewConfirm = useField('password', null);

    useEffect(() => {
        setNewPasswordError('');
    }, [passwordNew.value, passwordNewConfirm.value]);

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

    return (
        <div className='alignLeft infoBox'>
            {showPasswordFields ? (
                <div className='grid-container' data-gap='2rem'>
                    <div className='grid-container left' data-gap='1rem 2rem' style={{ gridTemplateColumns: 'auto 1fr' }}>
                        <div className='semiBold'>{contentToText(ContentID.accountPasswordCurrent, config)}:</div>
                        <div>
                            <InputField useField={passwordCurrent} width='32rem' />
                        </div>
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
                    {contentToText(ContentID.accountChangePassword, config)}
                </a>
            )}
        </div>
    );
};

export default UserChangePassword;

import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { User } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';

import { useCheckPasswordMutation } from '../../redux/slices/loginSlice';
import { setNotification } from '../../redux/miscReducer';
import { removeLoggedUser } from '../../redux/userReducer';
import { useUserDeleteMutation } from '../../redux/slices/userSlice';

import InputField from '../InputField';

interface Props {
    config: Config;
    user: User;
}
const UserDeleteAccount = ({ config, user }: Props) => {
    const [checkPassword] = useCheckPasswordMutation();
    const [userDelete] = useUserDeleteMutation();

    const dispatch = useDispatch();

    const [showPasswordField, setShowPasswordField] = useState<boolean>(false);

    const password = useField('password', null);

    const handleCancelButton = () => {
        password.clear();
        setShowPasswordField(false);
    };

    const handleDeleteAccount = async () => {
        // Check that the password is correct:
        const res = await checkPassword({ username: user.username, password: password.value.toString(), config: config }).unwrap();

        if (res.success) {
            const res = await userDelete({ toDelete: user, config: config }).unwrap();

            if (res.success) {
                dispatch(removeLoggedUser());
            }

            dispatch(setNotification({ message: res.message, tone: res.success ? 'Neutral' : 'Negative' }));
        } else {
            password.clear();
            dispatch(setNotification({ message: res.message, tone: 'Negative' }));
        }
    };

    return (
        <div className='alignLeft infoBox red'>
            {showPasswordField ? (
                <div className='grid-container' data-gap='2rem'>
                    <div className='colorRed preLine semiBold'>{contentToText(ContentID.accountDeleteAccountConfirm, config)}</div>
                    <div>
                        <InputField placeHolder={contentToText(ContentID.loginPassword, config)} useField={password} width='32rem' />
                    </div>
                    <div>
                        <button type='button' className='red' onClick={handleDeleteAccount} disabled={password.value.toString().length < 1}>
                            {contentToText(ContentID.accountDeleteAccount, config)}
                        </button>
                        &emsp;&emsp;
                        <button type='button' onClick={handleCancelButton}>
                            {contentToText(ContentID.buttonCancel, config)}
                        </button>
                    </div>
                </div>
            ) : (
                <a className='red sizeLarge' onClick={() => setShowPasswordField(true)}>
                    <div className='alignCenter'>{contentToText(ContentID.accountDeleteAccount, config)}</div>
                </a>
            )}
        </div>
    );
};

export default UserDeleteAccount;

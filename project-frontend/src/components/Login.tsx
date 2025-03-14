import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { User } from '../types/types';
import { RootState } from '../redux/rootReducer';

import { contentToText } from '../types/languageFunctions';
import localstorageHandler from '../util/localstorageHandler';
import { isResponse } from '../types/types';
import useField from '../hooks/useField';

import { useLoginMutation, useLogoutMutation } from '../redux/slices/loginSlice';
import { setNotification } from '../redux/miscReducer';
import { useSettingsGetQuery } from '../redux/slices/settingsSlice';
import { removeLoggedUser, setLoggedUser } from '../redux/userReducer';

import InputField from './InputField';
import { Link } from './CustomLink';

const Login = () => {
    const [login] = useLoginMutation();
    const [logout] = useLogoutMutation();
    const settingsGet = useSettingsGetQuery();

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const username = useField('text', ContentID.loginUsername);
    const password = useField('password', ContentID.loginPassword);

    const navigate = useNavigate();

    // Page title:
    useEffect(() => {
        document.title = settingsGet.data ? contentToText(ContentID.menuLogin, config) + ' | ' + settingsGet.data.storeName : '';
    }, [config, settingsGet.data]);

    const removeLogged = () => {
        dispatch(removeLoggedUser());
    };

    const setLogged = (loggedUser: User) => {
        dispatch(setLoggedUser(loggedUser));
    };

    const loginForm = () => (
        <div className='marginBottom2'>
            <form onSubmit={submit}>
                <div className='contentMaxWidth divCenter divMinWidth'>
                    <div data-testid='login-header' className='pageHeader'>
                        {contentToText(ContentID.menuLogin, config)}
                    </div>
                    <div className='grid-container valignMiddle' data-cols='login-form' data-gap='2rem'>
                        <div className='alignLeft noWrap semiBold'>{contentToText(username.label, config)}:</div>
                        <div>
                            <InputField testId='input-username' useField={username} width='18rem' autoFocus={true} />
                        </div>
                        <div className='alignLeft semiBold'>{contentToText(password.label, config)}:</div>
                        <div>
                            <InputField testId='input-password' useField={password} width='18rem' />
                        </div>
                        <div />
                        <div className='alignLeft'>
                            <button data-testid='button-submit' type='submit' disabled={username.stringValue().length < 1 || password.stringValue().length < 1}>
                                {contentToText(ContentID.menuLogin, config)}
                            </button>
                        </div>
                        <div />
                        <div className='alignLeft semiBold'>
                            {contentToText(ContentID.loginNoAccount, config)}{' '}
                            <Link data-testid='register-link' to='/register'>
                                {contentToText(ContentID.loginRegisterHere, config)}
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await login({
                username: username.stringValue(),
                password: password.stringValue(),
                setLoggedUser: setLogged,
                config: config,
            }).unwrap();

            password.clear();
            if (response.success) {
                username.clear();
                navigate(localstorageHandler.getPreviousLocation());
                dispatch(setNotification({ tone: 'Positive', message: response.message, testId: 'login-success' }));
            } else {
                dispatch(setNotification({ tone: 'Negative', message: response.message }));
            }
        } catch (err) {
            console.log('err:', err);
            if (isResponse(err)) {
                dispatch(setNotification({ tone: 'Negative', message: err.message }));
            }
        }
    };

    const userInfo = () => {
        if (usersState.loggedUser) {
            const logged = usersState.loggedUser;
            return (
                <div>
                    <div className='marginTop3 semiBold sizeVeryLarge'>
                        {contentToText(ContentID.miscLoggedInAs, config)}
                        <span className='bold'>{logged.username}</span>
                    </div>
                    <div className='marginTop3 sizeLarge'>
                        <Link to='/login' onClick={async () => await logout({ removeLoggedUser: removeLogged })}>
                            {contentToText(ContentID.menuLogout, config)}
                        </Link>
                    </div>
                </div>
            );
        }
    };

    return <div className='content-container'>{usersState.loggedUser ? userInfo() : loginForm()}</div>;
};

export default Login;

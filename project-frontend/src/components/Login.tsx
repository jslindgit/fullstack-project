import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { User } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import localstorageHandler from '../util/localstorageHandler';
import loginService from '../services/loginService';
import useField from '../hooks/useField';

import { setNotification } from '../reducers/miscReducer';
import { removeLoggedUser, setLoggedUser } from '../reducers/userReducer';

import InputField from './InputField';
import { Link } from './CustomLink';

const Login = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const username = useField('text', ContentID.loginUsername);
    const password = useField('password', ContentID.loginPassword);

    const navigate = useNavigate();

    // Page title:
    useEffect(() => {
        document.title = contentToText(ContentID.menuLogin, config) + ' | ' + config.store.contactName;
    }, [config]);

    const removeLogged = () => {
        dispatch(removeLoggedUser());
    };

    const setLogged = (loggedUser: User) => {
        dispatch(setLoggedUser(loggedUser));
    };

    const loginForm = () => (
        <div>
            <form onSubmit={submit}>
                <div className='divCenter divMinWidth'>
                    <div data-testid='login-header' className='pageHeader'>
                        {contentToText(ContentID.menuLogin, config)}
                    </div>
                    <div className='grid-container valignMiddle' data-cols='auto 1fr' data-gap='2rem'>
                        <div className='alignLeft semiBold'>{contentToText(username.label, config)}:</div>
                        <div>
                            <InputField testId='input-username' useField={username} width='20rem' autoFocus={true} />
                        </div>
                        <div className='alignLeft semiBold'>{contentToText(password.label, config)}:</div>
                        <div>
                            <InputField testId='input-password' useField={password} width='20rem' />
                        </div>
                        <div />
                        <div className='alignLeft'>
                            <button data-testid='button-submit' type='submit'>
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
        const response = await loginService.login(username.stringValue(), password.value.toString(), setLogged, config);
        password.clear();
        if (response.success) {
            username.clear();
            navigate(localstorageHandler.getPreviousLocation());
            dispatch(setNotification({ tone: 'Positive', message: response.message, testId: 'login-success' }));
        } else {
            dispatch(setNotification({ tone: 'Negative', message: response.message }));
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
                        <Link to='/login' onClick={async () => await loginService.logout(logged.token, removeLogged)}>
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

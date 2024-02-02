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

    // Title:
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
                <div style={{ margin: 'auto', width: 'min-content' }}>
                    <div className='pageHeader'>{contentToText(ContentID.menuLogin, config)}</div>
                    <div className='grid-container valignMiddle' data-gap='2rem' style={{ gridTemplateColumns: 'auto 1fr' }}>
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
                        <div className='alignLeft'>
                            {contentToText(ContentID.loginNoAccount, config)} <Link to='/register'>{contentToText(ContentID.loginRegisterHere, config)}</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await loginService.login(username.value.toString(), password.value.toString(), setLogged, config);
        password.reset();
        if (response.success) {
            username.reset();
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
                <>
                    <div className='bold sizeVeryLarge'>{logged.username}</div>
                    <br />
                    <Link to='/login' onClick={async () => await loginService.logout(logged.token, removeLogged)}>
                        <h3>{contentToText(ContentID.menuLogout, config)}</h3>
                    </Link>
                </>
            );
        }
    };

    return <div>{usersState.loggedUser ? userInfo() : loginForm()}</div>;
};

export default Login;

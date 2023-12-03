import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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

    const removeLogged = () => {
        dispatch(removeLoggedUser());
    };

    const setLogged = (loggedUser: User) => {
        dispatch(setLoggedUser(loggedUser));
    };

    const loginForm = () => (
        <div>
            <form onSubmit={submit}>
                <table align='center' width='1px' className='paddingTopBottomOnly'>
                    <tbody>
                        <tr>
                            <td colSpan={2} className='pageHeader'>
                                {contentToText(ContentID.menuLogin, config)}
                            </td>
                        </tr>
                        <tr>
                            <td className='semiBold widthByContent'>{contentToText(username.label, config)}:</td>
                            <td>
                                <InputField useField={username} width='20rem' />
                            </td>
                        </tr>
                        <tr>
                            <td className='semiBold'>{contentToText(password.label, config)}:</td>
                            <td>
                                <InputField useField={password} width='20rem' />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type='submit'>{contentToText(ContentID.menuLogin, config)}</button>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <br />
                                {contentToText(ContentID.loginNoAccount, config)}{' '}
                                <Link to='/register'>{contentToText(ContentID.loginRegisterHere, config)}</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );

    const userInfo = () => {
        if (usersState.loggedUser) {
            const logged = usersState.loggedUser;
            return (
                <>
                    <h2>Logged in as {logged.username}</h2>
                    <br />
                    <Link to='/login' onClick={async () => await loginService.logout(logged.token, removeLogged)}>
                        <h2>Logout</h2>
                    </Link>
                </>
            );
        }
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await loginService.login(username.value.toString(), password.value.toString(), setLogged, config);
        password.reset();
        if (response.success) {
            username.reset();
            navigate(localstorageHandler.getPreviousLocation());
            dispatch(setNotification({ tone: 'Positive', message: response.message }));
        } else {
            dispatch(setNotification({ tone: 'Negative', message: response.message }));
        }
    };

    return <div>{usersState.loggedUser ? userInfo() : loginForm()}</div>;
};

export default Login;

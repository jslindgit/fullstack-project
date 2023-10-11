import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { User } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import localstorageHandler from '../util/localstorageHandler';
import loginService from '../services/loginService';
import useField from '../hooks/useField';

import { setNotification } from '../reducers/miscReducer';
import { removeLoggedUser, setLoggedUser } from '../reducers/usersReducer';

import InputField from './InputField';

const Login = () => {
    const username = useField('text');
    const password = useField('password');

    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

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
                            <td className='pageHeader tight'>
                                <h3>Login</h3>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className='widthByContent'>Username:</td>
                            <td>
                                <InputField useField={username} width='15rem' />
                            </td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td>
                                <InputField useField={password} width='15rem' />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type='submit'>Login</button>
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
        const response = await loginService.login(username.value.toString(), password.value.toString(), setLogged);
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

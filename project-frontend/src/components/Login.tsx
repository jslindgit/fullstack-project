import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoggedUser } from '../types/types';
import { RootState } from '../reducers/root_reducer';

import loginService from '../services/loginService';

import { setLoggedUser } from '../reducers/users_reducer';

const Login = () => {
    const [message, setMessage] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

    const setLogged = (loggedUser: LoggedUser | null) => {
        dispatch(setLoggedUser(loggedUser));
    };

    const loginForm = () => (
        <>
            <h2>Login</h2>
            <form onSubmit={submit}>
                <table>
                    <tbody>
                        <tr>
                            <td width='10'>Username:</td>
                            <td>
                                <input value={username} onChange={({ target }) => setUsername(target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td>
                                <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
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
        </>
    );

    const userInfo = () => {
        if (usersState.loggedUser) {
            const logged = usersState.loggedUser;
            return (
                <>
                    <h2>Logged in as {logged.username}</h2>
                    <br />
                    <Link to='/login' onClick={async () => await loginService.logout(logged.token, setLogged)}>
                        <h2>Logout</h2>
                    </Link>
                </>
            );
        }
    };

    const showMessage = () => {
        if (message && message.length > 0) {
            return (
                <div>
                    <h1>{message}</h1>
                </div>
            );
        }
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await loginService.login(username, password, setLogged);
        setMessage(response);
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            {showMessage()}
            {usersState.loggedUser ? userInfo() : loginForm()}
        </div>
    );
};

export default Login;

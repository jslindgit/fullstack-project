import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { LoggedUser } from '../types/types';
import { RootState } from '../reducers/root_reducer';

import loginService from '../services/loginService';
import { setLoggedUser } from '../reducers/users_reducer';

import '../App.css';

const login = (loggedUser: LoggedUser | null, setLoggedUser: (loggedUser: LoggedUser | null) => void) => {
    if (loggedUser) {
        return (
            <>
                Logged in as {loggedUser?.username}
                {loggedUser.admin ? <> (Admin)</> : <></>}
                <br />
                <Link to='#' onClick={async () => await loginService.logout(loggedUser.token, setLoggedUser)}>
                    Logout
                </Link>
            </>
        );
    } else {
        return (
            <Link to='/login'>
                <h3>Login</h3>
            </Link>
        );
    }
};

const Menu = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.users);

    const setLogged = (loggedUser: LoggedUser | null) => {
        dispatch(setLoggedUser(loggedUser));
    };

    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <Link to='/'>
                                    <h3>Home</h3>
                                </Link>
                            </td>
                            {categoryState.map((c) => (
                                <td key={c.id}>
                                    <Link to={'/products/' + c.id}>
                                        <h3>{c.name}</h3>
                                    </Link>
                                </td>
                            ))}
                            <td>{login(usersState.loggedUser, setLogged)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

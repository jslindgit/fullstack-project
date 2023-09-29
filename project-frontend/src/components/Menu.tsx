import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link } from './CustomLink';

import { LoggedUser } from '../types/types';
import { RootState } from '../reducers/root_reducer';

import loginService from '../services/loginService';

import { setLoggedUser } from '../reducers/users_reducer';
import { setNotification } from '../reducers/misc_reducer';
import { setPreviousLocation } from '../reducers/misc_reducer';

import '../App.css';

const login = (loggedUser: LoggedUser | null, setLogged: (loggedUser: LoggedUser | null) => void, setLocation: () => void, setLogoutNotification: () => void) => {
    if (loggedUser) {
        return (
            <>
                {loggedUser?.username}
                {loggedUser.admin ? <> (Admin)</> : <></>}
                <br />
                <Link to='#' onClick={async () => await logout(loggedUser, setLogged, setLogoutNotification)}>
                    Logout
                </Link>
            </>
        );
    } else {
        return (
            <Link to='/login' onClick={() => setLocation()}>
                <h3>Login</h3>
            </Link>
        );
    }
};

const logout = async (loggedUser: LoggedUser, setLogged: (loggedUser: LoggedUser | null) => void, setLogoutNotification: () => void) => {
    await loginService.logout(loggedUser.token, setLogged);
    setLogoutNotification();
};

const Menu = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.users);

    const currentPath = useLocation().pathname;

    const setLogged = (loggedUser: LoggedUser | null) => {
        dispatch(setLoggedUser(loggedUser));
    };

    const setLocation = () => {
        dispatch(setPreviousLocation(currentPath));
    };

    const setLogoutNotification = () => {
        dispatch(setNotification({ tone: 'Neutral', message: 'Logged out' }));
    };

    const showAdminMenu = () => {
        if (usersState.loggedUser?.admin) {
            return (
                <td>
                    <Link to='/admin/'>
                        <h3>Admin</h3>
                    </Link>
                </td>
            );
        } else {
            return <></>;
        }
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
                            <td>{login(usersState.loggedUser, setLogged, setLocation, setLogoutNotification)}</td>
                            {showAdminMenu()}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

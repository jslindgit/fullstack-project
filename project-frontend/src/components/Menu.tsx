import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link } from './CustomLink';

import { User } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import loginService from '../services/loginService';

import { removeLoggedUser } from '../reducers/usersReducer';
import { setNotification } from '../reducers/miscReducer';
import { setPreviousLocation } from '../reducers/miscReducer';

const login = (loggedUser: User | null, removeLogged: () => void, setLocation: () => void, setLogoutNotification: () => void) => {
    if (loggedUser) {
        return (
            <>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <b>
                                    {loggedUser.username} {loggedUser.admin ? <> (Admin)</> : <></>}
                                </b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table align='center'>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Link to='/you' className='menuLink'>
                                                    Account
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to='#' className='menuLink' onClick={async () => await logout(loggedUser, removeLogged, setLogoutNotification)}>
                                                    Logout
                                                </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    } else {
        return (
            <Link to='/login' className='menuLink' onClick={() => setLocation()}>
                <h3>Login</h3>
            </Link>
        );
    }
};

const logout = async (loggedUser: User, removeLogged: () => void, setLogoutNotification: () => void) => {
    setLogoutNotification();
    await loginService.logout(loggedUser.token, removeLogged);
};

const Menu = () => {
    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

    const currentPath = useLocation().pathname;

    const removeLogged = () => {
        dispatch(removeLoggedUser());
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
                    <Link to='/admin/' className='menuLink'>
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
            <div className='menu'>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <Link to='/' className='menuLink'>
                                    <h3>Home</h3>
                                </Link>
                            </td>
                            <td>
                                <Link to='/shop' className='menuLink'>
                                    <h3>Products</h3>
                                </Link>
                            </td>
                            <td>{login(usersState.loggedUser, removeLogged, setLocation, setLogoutNotification)}</td>
                            {showAdminMenu()}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

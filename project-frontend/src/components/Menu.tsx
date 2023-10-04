import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { User } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import loginService from '../services/loginService';

import { removeLoggedUser } from '../reducers/usersReducer';
import { setNotification } from '../reducers/miscReducer';
import { setPreviousLocation } from '../reducers/miscReducer';

import { Link } from './CustomLink';

const Menu = () => {
    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

    const currentPath = useLocation().pathname;

    const login = (loggedUser: User | null, removeLogged: () => void, setLocation: () => void, setLogoutNotification: () => void) => {
        if (loggedUser) {
            return (
                <table align='center'>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }}>
                                {loggedUser.username} {loggedUser.admin ? <> (Admin)</> : <></>}
                            </td>
                        </tr>
                        <tr>
                            <td className='tight'>
                                <table align='center' width='100%'>
                                    <tbody>
                                        <tr>
                                            <td width='50%' className='tight'>
                                                {menuLink('/you', 'Account', 'Small')}
                                            </td>
                                            <td width='50%' className='tight' onClick={async () => await logout(loggedUser, removeLogged, setLogoutNotification)}>
                                                {menuLink('#', 'Logout', 'Small')}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
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

    const menuLink = (to: string, text: string, fontSize: 'Big' | 'Small' = 'Big') => (
        <Link to={to}>
            <table align='center' width='100%'>
                <tbody>
                    <tr>
                        <td className='menuLink'>{fontSize === 'Big' ? <h3>{text}</h3> : <>{text}</>}</td>
                    </tr>
                </tbody>
            </table>
        </Link>
    );

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
            return <td className='tight'>{menuLink('/admin', 'Admin')}</td>;
        } else {
            return <></>;
        }
    };

    return (
        <>
            <div className='menuNoLink'>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td className='tight'>{menuLink('/', 'Home')}</td>
                            <td className='tight'>{menuLink('/shop', 'Products')}</td>
                            <td className='tight' style={{ padding: 0 }}>
                                {login(usersState.loggedUser, removeLogged, setLocation, setLogoutNotification)}
                            </td>
                            {showAdminMenu()}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

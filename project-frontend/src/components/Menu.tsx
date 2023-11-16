import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { User } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import loginService from '../services/loginService';

import { contentToText } from '../types/languageFunctions';
import { removeLoggedUser } from '../reducers/usersReducer';
import { setNotification } from '../reducers/miscReducer';

import LanguageSelection from './LanguageSelection';
import { Link } from './CustomLink';
import { ContentID } from '../content';

const Menu = () => {
    const dispatch = useDispatch();
    const configState = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.users);

    const currentPath = useLocation().pathname;

    const login = (loggedUser: User | null, removeLogged: () => void, setLogoutNotification: () => void) => {
        if (loggedUser) {
            return (
                <table align='center'>
                    <tbody>
                        <tr>
                            <td className='sizeNormal semiBold' style={{ textAlign: 'center', paddingBottom: '3px', paddingTop: '6px' }}>
                                {loggedUser.username} {loggedUser.admin ? <span className='colorYellowLight'> ({contentToText(ContentID.menuAdmin, configState)})</span> : <></>}
                            </td>
                        </tr>
                        <tr>
                            <td className='tight'>
                                <table align='center' width='100%'>
                                    <tbody>
                                        <tr>
                                            <td width='1px' className='tight'>
                                                {menuLink('/you', contentToText(ContentID.menuAccount, configState), 'Small')}
                                            </td>
                                            <td className='tight' onClick={async () => await logout(loggedUser, removeLogged, setLogoutNotification)}>
                                                {menuLink('#', contentToText(ContentID.menuLogout, configState), 'Small')}
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
            return <div>{menuLink('/login', contentToText(ContentID.menuLogin, configState), 'Big')}</div>;
        }
    };

    const logout = async (loggedUser: User, removeLogged: () => void, setLogoutNotification: () => void) => {
        setLogoutNotification();
        await loginService.logout(loggedUser.token, removeLogged);
    };

    const menuLink = (to: string, text: string, fontSize: 'Big' | 'Small' = 'Big') => {
        let className = 'menuLink ' + (fontSize === 'Big' ? 'sizeLarge' : 'sizeNormal');
        if (fontSize === 'Small') {
            className += ' menuLinkSmall';
        }
        if ((to !== '/' && currentPath.includes(to)) || (currentPath === '/' && to === '/')) {
            className += ' currentPage';
        }

        return (
            <Link to={to}>
                <table align='center' width='100%'>
                    <tbody>
                        <tr>
                            <td className={className}>{text}</td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        );
    };

    const removeLogged = () => {
        dispatch(removeLoggedUser());
    };

    const setLogoutNotification = () => {
        dispatch(setNotification({ tone: 'Neutral', message: contentToText(ContentID.notificationLoggedOut, configState) }));
    };

    const showAdminMenu = () => {
        if (usersState.loggedUser?.admin) {
            return <td className='tight'>{menuLink('/admin', contentToText(ContentID.menuAdminSection, configState))}</td>;
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
                            <td>{menuLink('/', contentToText(ContentID.menuHome, configState))}</td>
                            <td>{menuLink('/shop', contentToText(ContentID.menuProducts, configState))}</td>
                            <td>{menuLink('/info', contentToText(ContentID.menuInfo, configState))}</td>
                            <td>{menuLink('/cart', contentToText(ContentID.menuShoppingCart, configState) + ' (' + miscState.shoppingCartItemCount + ')')}</td>
                            <td style={{ paddingLeft: '0.5rem', paddingRight: '2rem' }}>{login(usersState.loggedUser, removeLogged, setLogoutNotification)}</td>
                            <td>
                                <LanguageSelection />
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

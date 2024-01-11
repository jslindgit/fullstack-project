import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { User } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import loginService from '../services/loginService';
import useField from '../hooks/useField';
import { getUserStatus } from '../util/userProvider';

import { setNotification } from '../reducers/miscReducer';
import { removeLoggedUser } from '../reducers/userReducer';

import InputField from './InputField';
import LanguageSelection from './LanguageSelection';
import { Link } from './CustomLink';
import { ContentID } from '../content';

const Menu = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);
    const usersState = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const currentPath = useLocation().pathname;

    const searchField = useField('text', ContentID.miscSearch);

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (searchField.stringValue().length > 0) {
            navigate('/shop/search?q=' + searchField.stringValue());
            searchField.setNewValue('');
        }
    };

    const login = (loggedUser: User | null, removeLogged: () => void, setLogoutNotification: () => void) => {
        if (loggedUser) {
            return (
                <table align='center'>
                    <tbody>
                        <tr>
                            <td className='sizeSmallish semiBold' style={{ textAlign: 'center', paddingBottom: '3px', paddingTop: '6px' }}>
                                {loggedUser.username}{' '}
                                {loggedUser.admin || loggedUser.operator ? (
                                    <span className='colorYellowLight'> ({getUserStatus(loggedUser, config)})</span>
                                ) : (
                                    <></>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className='tight'>
                                <table align='center' width='100%'>
                                    <tbody>
                                        <tr>
                                            <td width='1px' className='tight'>
                                                {menuLink('/you', contentToText(ContentID.menuAccount, config), 'Small')}
                                            </td>
                                            <td className='tight' onClick={async () => await logout(loggedUser, removeLogged, setLogoutNotification)}>
                                                {menuLink('#', contentToText(ContentID.menuLogout, config), 'Small')}
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
            return <div>{menuLink('/login', contentToText(ContentID.menuLogin, config), 'Big')}</div>;
        }
    };

    const logout = async (loggedUser: User, removeLogged: () => void, setLogoutNotification: () => void) => {
        setLogoutNotification();
        await loginService.logout(loggedUser.token, removeLogged);
    };

    const menuLink = (to: string, text: string, fontSize: 'Big' | 'Small' = 'Big', isShoppingCart: boolean = false) => {
        let className = 'menuLink ' + (fontSize === 'Big' ? 'sizeLarge' : 'sizeNormal');
        if (fontSize === 'Small') {
            className += ' menuLinkSmall';
        }
        if (((to !== '/' && currentPath.includes(to)) || (currentPath === '/' && to === '/')) && !isShoppingCart) {
            className += ' currentPage';
        }

        const shoppingCartNumberOfItems = (): number => {
            return orderState.items.reduce((total, item) => total + item.quantity, 0);
        };

        return (
            <Link to={to}>
                <table align='center' width='100%'>
                    <tbody>
                        <tr>
                            <td className={className}>
                                {isShoppingCart ? (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className={currentPath.includes(to) ? 'currentPage' : ''}>{text}</span>
                                                    {shoppingCartNumberOfItems() > 0 ? <span>&ensp;</span> : ''}
                                                </td>
                                                {shoppingCartNumberOfItems() > 0 ? (
                                                    <td className='shoppingCartIndicator'>{shoppingCartNumberOfItems()}</td>
                                                ) : (
                                                    ''
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <>{text}</>
                                )}
                            </td>
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
        dispatch(setNotification({ tone: 'Positive', message: contentToText(ContentID.notificationLoggedOut, config) }));
    };

    const showAdminMenu = () => {
        if (usersState.loggedUser?.admin || usersState.loggedUser?.operator) {
            return <td className='tight'>{menuLink('/admin', contentToText(ContentID.menuAdminSection, config))}</td>;
        } else {
            return <></>;
        }
    };

    return (
        <form onSubmit={handleSearchSubmit}>
            <div className='menu'>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>{menuLink('/', contentToText(ContentID.menuHome, config))}</td>
                            <td>{menuLink('/shop', contentToText(ContentID.menuProducts, config))}</td>
                            <td>{menuLink('/info', contentToText(ContentID.menuInfo, config))}</td>
                            <td>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>{menuLink('/cart', contentToText(ContentID.menuShoppingCart, config), 'Big', true)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                                {login(usersState.loggedUser, removeLogged, setLogoutNotification)}
                            </td>
                            {showAdminMenu()}
                            <td>
                                <LanguageSelection />
                            </td>
                            <td style={{ paddingLeft: '2rem' }}>
                                <InputField
                                    useField={searchField}
                                    width='11rem'
                                    placeHolder={contentToText(ContentID.searchItemsName, config)}
                                    className='sizeSmallish'
                                />
                                &ensp;
                                <button type='submit' disabled={searchField.stringValue().length <= 0}>
                                    {contentToText(ContentID.miscSearch, config)}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>
    );
};

export default Menu;

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { User } from '../types/types';
import { RootState } from '../redux/rootReducer';

import { contentToText } from '../types/languageFunctions';
import localstorageHandler from '../util/localstorageHandler';
import useField from '../hooks/useField';

import { useLogoutMutation } from '../redux/slices/loginSlice';
import { setNotification } from '../redux/miscReducer';
import { removeLoggedUser } from '../redux/userReducer';

import InputField from './InputField';
import LanguageSelection from './LanguageSelection';
import { Link } from './CustomLink';

const Menu = () => {
    const [logoutMutation] = useLogoutMutation();

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
            localstorageHandler.setPreviousLocation(currentPath);
            navigate('/shop/search?q=' + searchField.stringValue());
            searchField.setNewValue('');
        }
    };

    const login = (loggedUser: User | null, removeLogged: () => void, setLogoutNotification: () => void) => {
        if (loggedUser) {
            return (
                <>
                    <div data-testid='logged-username' className='marginTop1em sizeSmallish semiBold'>
                        {loggedUser.username}{' '}
                    </div>
                    <div className='grid-container' data-cols='auto'>
                        <div>{menuLink('/you', contentToText(ContentID.menuAccount, config), 'Small', 'menu-account')}</div>
                        <div onClick={async () => await logout(removeLogged, setLogoutNotification)}>
                            {menuLink('#', contentToText(ContentID.menuLogout, config), 'Small', 'menu-logout')}
                        </div>
                    </div>
                </>
            );
        } else {
            return <>{menuLink('/login', contentToText(ContentID.menuLogin, config), 'Big', 'menu-login')}</>;
        }
    };

    const logout = async (removeLogged: () => void, setLogoutNotification: () => void) => {
        setLogoutNotification();
        await logoutMutation({ removeLoggedUser: removeLogged }).unwrap();
    };

    const menuLink = (to: string, text: string, fontSize: 'Big' | 'Small', testId: string, isShoppingCart: boolean = false) => {
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
                <div className={className} data-testid={testId}>
                    {isShoppingCart ? (
                        <div className='grid-container' data-cols='auto'>
                            <div>
                                <span className={currentPath.includes(to) ? 'currentPage' : ''}>{text}</span>
                                {shoppingCartNumberOfItems() > 0 ? <span>&ensp;</span> : ''}
                            </div>
                            {shoppingCartNumberOfItems() > 0 ? (
                                <div data-testid='cart-item-amount' className='shoppingCartIndicator'>
                                    {shoppingCartNumberOfItems()}
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    ) : (
                        <>{text}</>
                    )}
                </div>
            </Link>
        );
    };

    const removeLogged = () => {
        dispatch(removeLoggedUser());
    };

    const setLogoutNotification = () => {
        dispatch(setNotification({ tone: 'Neutral', message: contentToText(ContentID.notificationLoggedOut, config) }));
    };

    const showAdminMenu = () =>
        (usersState.loggedUser?.admin || usersState.loggedUser?.operator) && (
            <div>{menuLink('/admin', contentToText(ContentID.menuAdminSection, config), 'Big', 'menu-admin')}</div>
        );

    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                <div className='menu'>
                    <div>
                        <div className='flex-container' data-justify='center'>
                            <div>{menuLink('/', contentToText(ContentID.menuHome, config), 'Big', 'menu-home')}</div>
                            <div>{menuLink('/shop', contentToText(ContentID.menuProducts, config), 'Big', 'menu-shop')}</div>
                            <div>{menuLink('/info', contentToText(ContentID.menuInfo, config), 'Big', 'menu-info')}</div>
                            <div>{menuLink('/cart', contentToText(ContentID.menuShoppingCart, config), 'Big', 'menu-cart', true)}</div>
                            <div>{login(usersState.loggedUser, removeLogged, setLogoutNotification)}</div>
                            {showAdminMenu()}
                            <div className='marginLeft1 marginRight1 valignMiddle'>
                                <LanguageSelection />
                            </div>
                            <div className='grid-container marginBottom1 marginLeft1_5 marginTop1 valignMiddle' data-cols='auto' data-gap='1rem'>
                                <InputField
                                    useField={searchField}
                                    width='11rem'
                                    placeHolder={contentToText(ContentID.searchItemsName, config)}
                                    className='sizeSmallish'
                                />
                                <button type='submit' disabled={searchField.stringValue().length <= 0}>
                                    {contentToText(ContentID.miscSearch, config)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Menu;

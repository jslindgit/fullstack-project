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
                <>
                    <div className='sizeSmallish semiBold'>
                        {loggedUser.username}{' '}
                        {loggedUser.admin || loggedUser.operator ? <span className='colorYellowLight'>({getUserStatus(loggedUser, config)})</span> : <></>}
                    </div>
                    <div className='grid-container' data-cols='auto'>
                        <div>{menuLink('/you', contentToText(ContentID.menuAccount, config), 'Small')}</div>
                        <div onClick={async () => await logout(loggedUser, removeLogged, setLogoutNotification)}>
                            {menuLink('#', contentToText(ContentID.menuLogout, config), 'Small')}
                        </div>
                    </div>
                </>
            );
        } else {
            return <div>{menuLink('/login', contentToText(ContentID.menuLogin, config), 'Big', false, 'menu-login')}</div>;
        }
    };

    const logout = async (loggedUser: User, removeLogged: () => void, setLogoutNotification: () => void) => {
        setLogoutNotification();
        await loginService.logout(loggedUser.token, removeLogged);
    };

    const menuLink = (to: string, text: string, fontSize: 'Big' | 'Small' = 'Big', isShoppingCart: boolean = false, testId: string = '') => {
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
                            {shoppingCartNumberOfItems() > 0 ? <div className='shoppingCartIndicator'>{shoppingCartNumberOfItems()}</div> : ''}
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
        dispatch(setNotification({ tone: 'Positive', message: contentToText(ContentID.notificationLoggedOut, config) }));
    };

    const showAdminMenu = () =>
        (usersState.loggedUser?.admin || usersState.loggedUser?.operator) && <div>{menuLink('/admin', contentToText(ContentID.menuAdminSection, config))}</div>;

    return (
        <>
            <form onSubmit={handleSearchSubmit}>
                <div className='grid-container menu' style={{ gridTemplateColumns: '1fr min-content 1fr' }}>
                    <div />
                    <div className='grid-container' data-cols='auto'>
                        <div>{menuLink('/', contentToText(ContentID.menuHome, config))}</div>
                        <div>{menuLink('/shop', contentToText(ContentID.menuProducts, config))}</div>
                        <div>{menuLink('/info', contentToText(ContentID.menuInfo, config))}</div>
                        <div>{menuLink('/cart', contentToText(ContentID.menuShoppingCart, config), 'Big', true)}</div>
                        <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>{login(usersState.loggedUser, removeLogged, setLogoutNotification)}</div>
                        {showAdminMenu()}
                        <div className='valignMiddle' style={{ marginLeft: '1rem' }}>
                            <LanguageSelection />
                        </div>
                        <div className='grid-container valignMiddle' data-cols='auto' data-gap='1rem' style={{ marginLeft: '2.5rem' }}>
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
                    <div />
                </div>
            </form>
        </>
    );
};

export default Menu;

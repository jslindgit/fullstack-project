// Libraries:
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Types:
import { ContentID } from './content';
import { RootState } from './reducers/rootReducer';
import { User } from './types/types';

// Functions/values:
import { apiBaseUrl } from './constants';
import { contentToText } from './types/languageFunctions';
import localstorage_handler from './util/localstorageHandler';
import userService from './services/userService';

// Reducers:
import { initializeCategories } from './reducers/categoryReducer';
import { setLoaded } from './reducers/miscReducer';
import { loadShoppingCartFromLocalStorage } from './reducers/shoppingCartReducer';
import { removeLoggedUser, setLoggedUser } from './reducers/usersReducer';

// Components:
import AdminCategoryEdit from './components/Admin/AdminCategoryEdit';
import AdminItemEdit from './components/Admin/AdminItemEdit';
import AdminPanel from './components/Admin/AdminPanel';
import AdminUserInfo from './components/Admin/AdminUserInfo';
import Categories from './components/Categories';
import CheckOut from './components/CheckOut';
import CheckOutDone from './components/CheckOutDone';
import CheckOutPayment from './components/CheckOutPayment';
import Error404 from './components/Error404';
import Home from './components/Home';
import Info from './components/Info';
import ItemDetails from './components/ItemDetails';
import Items from './components/Items';
import Login from './components/Login';
import Menu from './components/Menu';
import Register from './components/Register';
import ShoppingCart from './components/ShoppinCart';
import ShowNotification from './components/ShowNotification';
import UserPanel from './components/UserPanel';

import './App.css';

const App = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(setLoaded(false));

        dispatch(loadShoppingCartFromLocalStorage());

        void axios.get(`${apiBaseUrl}/ping`);

        const fetchData = async () => {
            await initializeCategories(dispatch);
        };

        const setUser = async () => {
            const token = localstorage_handler.getToken();
            let loggedUser: User | undefined = undefined;
            if (token) {
                loggedUser = await userService.getByToken(token);
            }
            if (loggedUser) {
                dispatch(setLoggedUser(loggedUser));
            } else {
                dispatch(removeLoggedUser());
                localstorage_handler.removeToken();
            }
        };

        fetchData().then(() => {
            setUser()
                .then(() => {
                    dispatch(setLoaded(true));
                })
                .catch(() => {
                    dispatch(removeLoggedUser());
                    localstorage_handler.removeToken();
                    dispatch(setLoaded(true));
                });
        });
    }, [dispatch]);

    const adminPage = (page: JSX.Element): JSX.Element => {
        if (usersState.loggedUser?.admin) {
            return page;
        } else {
            return <Error404 />;
        }
    };

    if (!miscState.loaded) {
        return (
            <div className='semiBold sizeLarge'>
                <br />
                {contentToText(ContentID.miscLoading, config)}
            </div>
        );
    }
    return (
        <Router>
            <Menu />
            <ShowNotification />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/admin' element={adminPage(<AdminPanel />)} />
                <Route path='/admin/editcategory/:id' element={adminPage(<AdminCategoryEdit />)} />
                <Route path='/admin/edititem/:id' element={adminPage(<AdminItemEdit />)} />
                <Route path='/admin/users/:id' element={adminPage(<AdminUserInfo />)} />
                <Route path='/admin/:page' element={adminPage(<AdminPanel />)} />
                <Route path='/cart' element={<ShoppingCart />} />
                <Route path='/checkout' element={<CheckOut />} />
                <Route path='/info' element={<Info />} />
                <Route path='/login' element={<Login />} />
                <Route path='/success' element={<CheckOutDone />} />
                <Route path='/payment' element={<CheckOutPayment />} />
                <Route path='/register' element={<Register />} />
                <Route path='/shop' element={<Categories />} />
                <Route path='/shop/item/:id' element={<ItemDetails />} />
                <Route path='/shop/:id' element={<Items />} />
                <Route path='/you' element={<UserPanel />} />
                <Route path='*' element={<Error404 />} />
            </Routes>
        </Router>
    );
};

export default App;

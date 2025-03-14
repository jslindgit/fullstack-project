// Libraries:
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Types:
import { RootState } from './redux/rootReducer';

// Functions:

// Redux:
import { initializeConfig } from './redux/configReducer';
import { setLoaded } from './redux/miscReducer';
import { initializeOrder } from './redux/orderReducer';
import { useSettingsGetQuery } from './redux/slices/settingsSlice';
import store from './redux/store';
import { initializeLoggedUser } from './redux/userReducer';

// Components:
import AdminCategoryEdit from './components/Admin/AdminCategoryEdit';
import AdminItemEdit from './components/Admin/AdminItemEdit';
import AdminPanel from './components/Admin/AdminPanel';
import AdminUserInfo from './components/Admin/AdminUserInfo';
import Categories from './components/Categories';
import CheckOut from './components/CheckOut/CheckOut';
import CheckOutCreateOrder from './components/CheckOut/CheckOutCreateOrder';
import CheckOutDone from './components/CheckOut/CheckOutDone';
import CheckOutPayment from './components/CheckOut/CheckOutPayment';
import Error404 from './components/Error404';
import Footer from './components/Footer';
import Home from './components/Home';
import Info from './components/Info';
import ItemDetails from './components/Items/ItemDetails';
import Items from './components/Items/Items';
import ItemsSearch from './components/Items/ItemsSearch';
import Loading from './components/Loading';
import Login from './components/Login';
import Menu from './components/Menu';
import Register from './components/Register';
import ShoppingCart from './components/ShoppingCart/ShoppinCart';
import ShowNotification from './components/ShowNotification';
import UserPanel from './components/User/UserPanel';

const App = () => {
    const settings = useSettingsGetQuery();

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const userState = useSelector((state: RootState) => state.user);

    // Initialize Config, Order and logged User states:
    useEffect(() => {
        dispatch(setLoaded(false));

        const fetchData = async () => {
            initializeConfig(dispatch);
            initializeOrder(dispatch);
            await Promise.all([initializeLoggedUser(dispatch, store.dispatch)]);
        };

        fetchData();
    }, [dispatch]);

    // Set page title:
    useEffect(() => {
        document.title = settings.data ? settings.data.storeName : '';
    }, [settings.data]);

    // Set miscState.loaded to true:
    useEffect(() => {
        if (!miscState.loaded && userState.initialized) {
            dispatch(setLoaded(true));
        }
    }, [dispatch, userState.initialized, miscState.loaded]);

    const adminPage = (page: JSX.Element): JSX.Element => {
        return userState.loggedUser?.admin || userState.loggedUser?.operator ? page : <Error404 />;
    };

    if (!miscState.loaded) {
        return (
            <div className='app-container'>
                <div className='content-container alignCenter valignMiddle'>
                    <div className='alignCenter'>
                        <Loading config={config} />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='app-container'>
            <Router>
                <Menu />
                <ShowNotification />
                <div className='content-container'>
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
                        <Route path='/order' element={<CheckOutCreateOrder />} />
                        <Route path='/payment' element={<CheckOutPayment />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/shop' element={<Categories />} />
                        <Route path='/shop/search' element={<ItemsSearch />} />
                        <Route path='/shop/item/:id' element={<ItemDetails />} />
                        <Route path='/shop/:id' element={<Items />} />
                        <Route path='/you' element={<UserPanel />} />
                        <Route path='*' element={<Error404 />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </div>
    );
};

export default App;

// Libraries:
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Types:
import { ContentID } from './content';
import { RootState } from './reducers/rootReducer';

// Functions/values:
import { contentToText } from './types/languageFunctions';

// Reducers:
import { initializeCategories } from './reducers/categoryReducer';
import { initializeConfig } from './reducers/configReducer';
import { setLoaded } from './reducers/miscReducer';
import { initializeOrder } from './reducers/orderReducer';
import { initializeLoggedUser } from './reducers/userReducer';

// Components:
import AdminCategoryEdit from './components/Admin/AdminCategoryEdit';
import AdminItemEdit from './components/Admin/AdminItemEdit';
import AdminPanel from './components/Admin/AdminPanel';
import AdminUserInfo from './components/Admin/AdminUserInfo';
import Categories from './components/Categories';
import CheckOut from './components/CheckOut';
import CheckOutCreateOrder from './components/CheckOutCreateOrder';
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
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const userState = useSelector((state: RootState) => state.user);

    useEffect(() => {
        document.title = config.store.contactName;

        dispatch(setLoaded(false));

        const fetchData = async () => {
            initializeConfig(dispatch);
            initializeOrder(dispatch);
            Promise.all([initializeLoggedUser(dispatch), initializeCategories(dispatch)]);
        };

        fetchData();
    }, [config.store.contactName, dispatch]);

    // Set miscState.loaded to true:
    useEffect(() => {
        if (categoryState.initialized && userState.initialized) {
            dispatch(setLoaded(true));
        }
    }, [categoryState.initialized, dispatch, userState.initialized]);

    const adminPage = (page: JSX.Element): JSX.Element => {
        if (userState.loggedUser?.admin) {
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
                <Route path='/order' element={<CheckOutCreateOrder />} />
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

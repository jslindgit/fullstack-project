// Libraries:
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Types:
import { RootState } from './reducers/root_reducer';

// Functions/values:
import { apiBaseUrl } from './constants';
import categoryService from './services/categoryService';
import localstorage_handler from './util/localstorage_handler';

// Reducers:
import { setCategories } from './reducers/category_reducer';
import { setLoggedUser } from './reducers/users_reducer';

// Components:
import AdminPanel from './components/Admin/AdminPanel';
import Error404 from './components/Error404';
import Home from './components/Home';
import Items from './components/Items';
import Login from './components/Login';
import Menu from './components/Menu';
import ShowNotification from './components/ShowNotification';

import './App.css';

const App = () => {
    const [loaded, setLoaded] = useState<boolean>(false);

    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

    useEffect(() => {
        void axios.get(`${apiBaseUrl}/ping`);

        const fetchData = async () => {
            dispatch(setCategories(await categoryService.getAll()));
        };
        void fetchData();

        dispatch(setLoggedUser(localstorage_handler.getLoggedUser()));

        setLoaded(true);
    }, [dispatch]);

    const adminPage = (): JSX.Element => {
        if (usersState.loggedUser?.admin) {
            return <AdminPanel />;
        } else {
            return <Error404 />;
        }
    };

    if (!loaded) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <Router>
                                    <Menu />
                                    <ShowNotification />
                                    <Routes>
                                        <Route path='/' element={<Home />} />
                                        <Route path='/login' element={<Login />} />
                                        <Route path='/products/:id' element={<Items />} />
                                        <Route path='/admin' element={adminPage()} />
                                        <Route path='/admin/:page' element={adminPage()} />
                                        <Route path='*' element={<Error404 />} />
                                    </Routes>
                                </Router>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default App;

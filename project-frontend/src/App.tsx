// Libraries:
import { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Types:
import { RootState } from './reducers/rootReducer';
import { User } from './types/types';

// Functions/values:
import { apiBaseUrl } from './constants';
import localstorage_handler from './util/localstorage_handler';
import userService from './services/userService';

// Reducers:
import { setLoaded } from './reducers/miscReducer';
import { removeLoggedUser, setLoggedUser } from './reducers/usersReducer';
import { initializeCategories } from './reducers/categoryReducer';

// Components:
import AdminPanel from './components/Admin/AdminPanel';
import Categories from './components/Categories';
import Error404 from './components/Error404';
import Home from './components/Home';
import Items from './components/Items';
import Login from './components/Login';
import Menu from './components/Menu';
import ShowNotification from './components/ShowNotification';
import UserPanel from './components/UserPanel';

import './App.css';

const App = () => {
    const dispatch = useDispatch();
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.users);

    useEffect(() => {
        dispatch(setLoaded(false));

        void axios.get(`${apiBaseUrl}/ping`);

        const fetchData = async () => {
            await initializeCategories(dispatch);
        };
        void fetchData();

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
        setUser()
            .then(() => {
                dispatch(setLoaded(true));
            })
            .catch(() => {
                dispatch(removeLoggedUser());
                localstorage_handler.removeToken();
                dispatch(setLoaded(true));
            });
    }, [dispatch]);

    const adminPage = (): JSX.Element => {
        if (usersState.loggedUser?.admin) {
            return <AdminPanel />;
        } else {
            return <Error404 />;
        }
    };

    if (!miscState.loaded) {
        return <div>Loading...</div>;
    }
    return (
        <table align='center' width='100%'>
            <tbody>
                <tr>
                    <td>
                        <Router>
                            <Menu />
                            <ShowNotification />
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/admin' element={adminPage()} />
                                <Route path='/admin/:page' element={adminPage()} />
                                <Route path='/login' element={<Login />} />
                                <Route path='/shop' element={<Categories />} />
                                <Route path='/shop/:id' element={<Items />} />
                                <Route path='/you' element={<UserPanel />} />
                                <Route path='*' element={<Error404 />} />
                            </Routes>
                        </Router>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default App;

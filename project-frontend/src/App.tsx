import './App.css';

// Libraries:
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Functions/values:
import { apiBaseUrl } from './constants';
import categoryService from './services/categoryService';
import localstorage_handler from './util/localstorage_handler';

// Reducers:
import { setCategories } from './reducers/category_reducer';
import { setLoggedUser } from './reducers/users_reducer';

// Components:
import Home from './components/Home';
import Items from './components/Items';
import Menu from './components/Menu';
import Login from './components/Login';

function App() {
    const [loaded, setLoaded] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {
        void axios.get(`${apiBaseUrl}/ping`);

        const fetchData = async () => {
            dispatch(setCategories(await categoryService.getAll()));
        };
        void fetchData();

        dispatch(setLoggedUser(localstorage_handler.getLoggedUser()));

        setLoaded(true);
    }, [dispatch]);

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
                                    <Routes>
                                        <Route path='/' element={<Home />} />
                                        <Route path='/login' element={<Login />} />
                                        <Route path='/products/:id' element={<Items />} />
                                    </Routes>
                                </Router>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default App;

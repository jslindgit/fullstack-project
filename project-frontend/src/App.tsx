import './App.css';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { apiBaseUrl } from './constants';
import { Category, Config, LoggedUser } from './types/types';
import categoryService from './services/categoryService';
import { defaultConfig } from './constants';
import localstorage_handler from './util/localstorage_handler';

import Home from './components/Home';
import Items from './components/Items';
import Menu from './components/Menu';
import Login from './components/Login';

function App() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [config, setConfig] = useState<Config>(defaultConfig);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

    useEffect(() => {
        void axios.get(`${apiBaseUrl}/ping`);

        const fetchData = async () => {
            setConfig(defaultConfig); // temp

            const categories = await categoryService.getAll();
            setCategories(categories);
        };
        void fetchData();

        setLoggedUser(localstorage_handler.getLoggedUser());

        setLoaded(true);
    }, []);

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
                                    <Menu categories={categories} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
                                    <Routes>
                                        <Route path='/' element={<Home config={config} />} />
                                        <Route path='/login' element={<Login loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
                                        <Route path='/products/:id' element={<Items categories={categories} loggedUser={loggedUser} />} />
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

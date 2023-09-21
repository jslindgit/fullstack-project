import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { apiBaseUrl } from './constants';
import { Category, Config } from './types/types';
import categoryService from './services/categoryService';
import { defaultConfig } from './types/types';

import './App.css';
import MainPage from './components/MainPage';
import Menu from './components/Menu';
import Items from './components/Items';

function App() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [config, setConfig] = useState<Config>(defaultConfig);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        void axios.get(`${apiBaseUrl}/ping`);

        const fetchData = async () => {
            setConfig(defaultConfig); // temp

            const categories = await categoryService.getAll();
            setCategories(categories);
        };
        void fetchData();

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
                                    <Menu categories={categories} />
                                    <Routes>
                                        <Route path='/' element={<MainPage config={config} />} />
                                        <Route path='/products/:id' element={<Items categories={categories} />} />
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

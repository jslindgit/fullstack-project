import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { apiBaseUrl } from './constants';
import { Category, Config, Item } from './types';
import itemService from './services/itemService';
import categoryService from './services/categoryService';
import { defaultConfig } from './types';

import './App.css';
import MainPage from './components/MainPage';
import Menu from './components/Menu';
import Items from './components/Items';

function App() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [config, setConfig] = useState<Config>(defaultConfig);
    const [items, setItems] = useState<Item[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        void axios.get(`${apiBaseUrl}/ping`);

        const fetchData = async () => {
            setConfig(defaultConfig); // temp

            const items = await itemService.getAll();
            setItems(items);

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
                                <Menu categories={categories} />
                                <Router>
                                    <Routes>
                                        <Route path='/' element={<MainPage config={config} />} />
                                        <Route
                                            path='/liput'
                                            element={<Items categories={categories} categoryId={1} />}
                                        />
                                        <Route
                                            path='/viirit'
                                            element={<Items categories={categories} categoryId={2} />}
                                        />
                                    </Routes>
                                </Router>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h1>Items</h1>
                                <table>
                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td>{item.price} €</td>
                                                <td>In stock: {item.instock}</td>
                                                <td>Product code: {item.id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default App;

import { useEffect, useState } from 'react';
import axios from 'axios';

import { apiBaseUrl } from './constants';
import { Item } from './types';
import itemService from './services/itemService';

import './App.css';
import Menu from './components/Menu';

function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item>();

    useEffect(() => {
        void axios.get(`${apiBaseUrl}/ping`);

        const fetchItems = async () => {
            const items = await itemService.getAll();
            setItems(items);
        };
        void fetchItems();

        const fetchSelectedItem = async () => {
            const item = await itemService.getById(2);
            setSelectedItem(item);
        };
        void fetchSelectedItem();

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
                                <Menu />
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
                <p>Selected: {selectedItem ? selectedItem.name : 'None'}</p>
            </div>
        </>
    );
}

export default App;

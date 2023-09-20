import { useEffect, useState } from 'react';
import '../App.css';
import { Category } from '../types';
import categoryService from '../services/categoryService';

const Menu = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await categoryService.getAll();
            setCategories(categories);
        };
        void fetchCategories();

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
                            {categories.map((c) => (
                                <td key={c.id}>
                                    <h2>{c.name}</h2>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

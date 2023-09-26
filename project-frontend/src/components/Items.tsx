import '../App.css';

import { useParams } from 'react-router-dom';

import { isNumber } from '../types/type_functions';
import { Category, LoggedUser } from '../types/types';

import AddItemForm from './AddItemForm';

interface Props {
    categories: Category[];
    loggedUser: LoggedUser | null;
}

const Items = ({ categories, loggedUser }: Props) => {
    const id = Number(useParams().id);
    const category = id && isNumber(id) ? categories.find((c) => c.id === id) : undefined;

    if (category === undefined) {
        return <div>Something went wrong.</div>;
    }

    return (
        <>
            <div>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <table align='center'>
                    <tbody>
                        {category.items.map((item) => (
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
                {loggedUser?.admin ? <AddItemForm /> : <></>}
            </div>
        </>
    );
};

export default Items;

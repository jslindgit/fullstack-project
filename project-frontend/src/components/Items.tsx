import '../App.css';

import { useParams } from 'react-router-dom';

import { isNumber } from '../types/type_functions';
import { Category, Config, LoggedUser } from '../types/types';

import AddItemForm from './AddItemForm';

interface Props {
    categories: Category[];
    loggedUser: LoggedUser | null;
    config: Config;
}

const Items = ({ categories, loggedUser, config }: Props) => {
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
                        <tr>
                            <td>Product</td>
                            <td>Description</td>
                            <td>Price</td>
                            <td>In stock</td>
                            <td>Product code</td>
                        </tr>
                        {category.items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.price} €</td>
                                <td>{item.instock}</td>
                                <td>{item.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loggedUser?.admin ? <AddItemForm token={loggedUser?.token} config={config} categories={categories} /> : <></>}
            </div>
        </>
    );
};

export default Items;

import '../App.css';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers/root_reducer';

import { isNumber } from '../types/type_functions';
import format from '../util/format';

import AddItemForm from './AddItemForm';

const Items = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.users);

    const id = Number(useParams().id);
    const category = id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;

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
                                <td>{format.currency(item.price, configState)}</td>
                                <td>{item.instock}</td>
                                <td>{item.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usersState.loggedUser?.admin ? <AddItemForm token={usersState.loggedUser?.token} selected_category_id={id} /> : <></>}
            </div>
        </>
    );
};

export default Items;

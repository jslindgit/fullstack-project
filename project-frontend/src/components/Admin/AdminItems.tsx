import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import { isNumber } from '../../types/type_functions';
import itemService from '../../services/itemService';

import { setNotification } from '../../reducers/miscReducer';
import { initializeCategories } from '../../reducers/categoryReducer';

import AddItemForm from '../Admin/AddItemForm';

const AdminItems = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.users);

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const id = Number(searchParams.get('category'));
    const category = id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;

    useEffect(() => {
        if (miscState.loaded && category === undefined) {
            navigate('/shop');
        }
    }, [category, miscState.loaded, navigate]);

    const deleteItem = async (item: Item) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`Delete item ${item.name}?`)) {
            const res = await itemService.deleteItem(item, usersState.loggedUser.token);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

            if (res.success) {
                await initializeCategories(dispatch);
            }
        }
    };

    if (!category) {
        return <>Error: Category not found</>;
    }
    return (
        <div>
            <h2>Admin Panel - Items</h2>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <table align='center'>
                <tbody>
                    <tr className='bold'>
                        <td>Product</td>
                        <td>Description</td>
                        <td>Price</td>
                        <td>In stock</td>
                        <td>ID</td>
                        <td></td>
                    </tr>
                    {category.items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{format.currency(item.price, configState)}</td>
                            <td>{item.instock}</td>
                            <td>{item.id}</td>
                            <td>
                                <button onClick={() => deleteItem(item)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {usersState.loggedUser?.admin ? <AddItemForm user={usersState.loggedUser} selected_category_id={id} /> : <></>}
        </div>
    );
};

export default AdminItems;

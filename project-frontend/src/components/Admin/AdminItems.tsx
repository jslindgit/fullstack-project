import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { isNumber } from '../../types/type_functions';
import itemService from '../../services/itemService';

import { setNotification } from '../../reducers/miscReducer';

import AdminItem from './AdminItem';
import AddItemForm from '../Admin/AddItemForm';

const AdminItems = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.users);

    const [items, setItems] = useState<Item[]>([]);
    const [edited, setEdited] = useState<Item | null>(null);

    const [searchParams] = useSearchParams();

    const id = Number(searchParams.get('category'));
    const category = id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;

    const deleteItem = async (item: Item) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`Delete item ${item.name}?`)) {
            const res = await itemService.deleteItem(item, usersState.loggedUser.token, dispatch);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
        }
    };

    const editItem = (item: Item) => {
        console.log('setEdited:', item.name);
        setEdited(item);
    };

    const editItemSubmit = () => {
        if (edited) {
            console.log('saveing ' + edited.name);
        }
    };

    useEffect(() => {
        if (category) {
            setItems(category.items);
        } else {
            itemService
                .getAll()
                .then((res) => {
                    setItems(res?.filter((i) => i.categories.length === 0));
                })
                .catch((err: unknown) => {
                    console.log(err);
                });
        }
    }, [category]);

    return (
        <div>
            <h2>Admin Panel - Items</h2>
            <h2>{category ? category.name : 'Uncategorized'}</h2>
            <p>{category ? category.description : 'Items that do not currently belong to any categories'}</p>
            {/*<form onSubmit={editItemSubmit}>*/}
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
                    {items.map((item) => (
                        <AdminItem key={item.id} item={item} isEdited={edited === item} deleteItem={deleteItem} editItem={editItem} />
                    ))}
                </tbody>
            </table>
            {/*</form>*/}
            {usersState.loggedUser?.admin ? <AddItemForm user={usersState.loggedUser} selected_category_id={id} /> : <></>}
        </div>
    );
};

export default AdminItems;

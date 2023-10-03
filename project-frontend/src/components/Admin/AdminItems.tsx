import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';

import itemService from '../../services/itemService';
import useField from '../../hooks/useField';
import { isNumber } from '../../types/type_functions';

import { setNotification } from '../../reducers/miscReducer';

import AdminItem from './AdminItem';
import AddItemForm from '../Admin/AddItemForm';

export interface ItemInputs {
    name: UseField;
    description: UseField;
    price: UseField;
    instock: UseField;
}

const AdminItems = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.users);

    const [items, setItems] = useState<Item[]>([]);
    const [edited, setEdited] = useState<Item | null>(null);

    const inputs: ItemInputs = {
        name: useField('text'),
        description: useField('text'),
        price: useField('number'),
        instock: useField('number'),
    };

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
        setEdited(item);

        inputs.name.setNewValue(item.name);
        inputs.description.setNewValue(item.description);
        inputs.price.setNewValue(Number(item.price));
        inputs.instock.setNewValue(item.instock);
    };

    const editItemCancel = () => {
        setEdited(null);
    };

    const editItemSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (
            edited &&
            (edited.name !== inputs.name.value ||
                edited.description !== inputs.description.value ||
                edited.price.toString() !== inputs.price.value.toString() ||
                edited.instock.toString() !== inputs.instock.value.toString())
        ) {
            console.log('saving ' + edited.name);
            console.log(edited.name + ' ' + inputs.name.value);
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
            <form onSubmit={editItemSubmit}>
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
                            <AdminItem key={item.id} item={item} isEdited={edited === item} inputs={inputs} deleteItem={deleteItem} editItem={editItem} editItemCancel={editItemCancel} />
                        ))}
                    </tbody>
                </table>
            </form>
            {usersState.loggedUser?.admin ? <AddItemForm user={usersState.loggedUser} selected_category_id={id} /> : <></>}
        </div>
    );
};

export default AdminItems;

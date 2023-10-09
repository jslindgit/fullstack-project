import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Category, Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';

import { handleError } from '../../util/error_handler';
import itemService from '../../services/itemService';
import item_categoryService from '../../services/item_categoryService';
import useField from '../../hooks/useField';
import { isNumber } from '../../types/type_functions';

import { setNotification } from '../../reducers/miscReducer';

import AdminItem from './AdminItem';
import AddItemForm from '../Admin/AddItemForm';
import { Link } from '../CustomLink';

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

    const [searchParams] = useSearchParams();

    const getCategoryFromParams = (): Category | undefined => {
        const id = Number(searchParams.get('category'));
        return id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;
    };

    const [category, setCategory] = useState<Category | undefined>(getCategoryFromParams());
    const [items, setItems] = useState<Item[]>([]);
    const [categoriesChanged, setCategoriesChanged] = useState<boolean>(false);
    const [editedItem, setEditedItem] = useState<Item | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const inputs: ItemInputs = {
        name: useField('text'),
        description: useField('text'),
        price: useField('number'),
        instock: useField('number'),
    };

    useEffect(() => {
        const id = Number(searchParams.get('category'));
        setCategory(id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined);
    }, [searchParams, categoryState]);

    const refreshItems = () => {
        if (category) {
            setItems(category.items);
        } else {
            itemService
                .getAll()
                .then((res) => {
                    setItems(res?.filter((i) => i.categories.length === 0));
                })
                .catch((err: unknown) => {
                    handleError(err);
                });
        }
    };

    useEffect(() => {
        refreshItems();
    }, [category]);

    const deleteItem = async (item: Item) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`Delete item ${item.name}?`)) {
            const res = await itemService.deleteItem(item, usersState.loggedUser.token, dispatch);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

            refreshItems();
        }
    };

    const editItem = (item: Item) => {
        setEditedItem(item);

        inputs.name.setNewValue(item.name);
        inputs.description.setNewValue(item.description);
        inputs.price.setNewValue(Number(item.price));
        inputs.instock.setNewValue(item.instock);
    };

    const editItemCancel = () => {
        setEditedItem(null);
    };

    const editItemSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (
            editedItem &&
            (editedItem.name !== inputs.name.value ||
                editedItem.description !== inputs.description.value ||
                editedItem.price.toString() !== inputs.price.value.toString() ||
                editedItem.instock.toString() !== inputs.instock.value.toString() ||
                categoriesChanged)
        ) {
            if (usersState.loggedUser && usersState.loggedUser.token) {
                const token = usersState.loggedUser.token;

                const updatedItem = {
                    ...editedItem,
                    name: inputs.name.value.toString(),
                    description: inputs.description.value.toString(),
                    price: Number(inputs.price.value),
                    instock: Number(inputs.instock.value),
                };

                // Add connections between the edited Item and the selected Categories that are not yet connected to the Item:
                selectedCategories.forEach(async (selected) => {
                    const category = categoryState.find((c) => {
                        return c.id === selected;
                    });
                    if (category && editedItem.categories.includes(category) === false) {
                        const res = await item_categoryService.addConnection(editedItem, category, token);
                        if (!res.success) {
                            handleError(new Error(res.message));
                        }
                    }
                });

                // Remove connections between the edited Item and Categories that are currently connected to the Item:
                const toRemove = editedItem.categories.filter((c) => {
                    selectedCategories.includes(c.id) === false;
                });
                toRemove.forEach(async (c) => {
                    const res = await item_categoryService.deleteConnection(editedItem.id, c.id, token);
                    if (!res.success) {
                        handleError(new Error(res.message));
                    }
                });

                // Update the other info (name, description, etc):
                const res = await itemService.update(updatedItem, usersState.loggedUser.token, dispatch);

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

                setEditedItem(null);

                refreshItems();
            } else {
                handleError(new Error('Missing token'));
            }
        }
    };

    return (
        <div>
            <table style={{ paddingBottom: 'calc(var(--default-padding) * 1)' }}>
                <tbody>
                    <tr>
                        {categoryState.map((c) => (
                            <td key={c.id}>
                                <Link to={'/admin/items?category=' + c.id}>{c.name}</Link>
                            </td>
                        ))}
                        <td>
                            <Link to='/admin/items/'>Uncategorized</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h4>{category ? category.name : 'Uncategorized'}</h4>
            <p>{category ? category.description : 'Items that do not currently belong to any category'}</p>
            <form onSubmit={editItemSubmit} className='adminFormItemEdit'>
                <table align='center' width='100%' className='sizeSmallish paddingTopBottomOnly dotted'>
                    <tbody>
                        <tr className='bold'>
                            <td>Product</td>
                            <td>Description</td>
                            <td>Price</td>
                            <td>In stock</td>
                            <td>ID</td>
                            <td>Categories</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {items.map((item) => (
                            <AdminItem
                                key={item.id}
                                item={item}
                                isEdited={editedItem === item}
                                inputs={inputs}
                                deleteItem={deleteItem}
                                editItem={editItem}
                                editItemCancel={editItemCancel}
                                setSelectedCategories={setSelectedCategories}
                                setCategoriesChanged={setCategoriesChanged}
                            />
                        ))}
                    </tbody>
                </table>
            </form>
            <br />
            {usersState.loggedUser?.admin ? <AddItemForm user={usersState.loggedUser} category={category} items={items} setItems={setItems} /> : <></>}
        </div>
    );
};

export default AdminItems;

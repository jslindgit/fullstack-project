import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';

import { setNotification } from '../../reducers/miscReducer';

import { handleError } from '../../util/handleError';
import item_categoryService from '../../services/item_categoryService';
import itemService from '../../services/itemService';
import { pageWidth } from '../../constants';
import useField from '../../hooks/useField';
import useTextArea from '../../hooks/useTextArea';

import BackButton from '../BackButton';

const AdminItemEdit = () => {
    const dispatch = useDispatch();
    const categoriesState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.users);

    const [item, setItem] = useState<Item | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const [categoriesChanged, setCategoriesChanged] = useState<boolean>(false);

    const name = useField('text');
    const description = useTextArea();
    const price = useField('decimal');
    const instock = useField('integer');

    const id = Number(useParams().id);

    const setItemById = () => {
        try {
            itemService.getById(id).then((res) => {
                setItem(res as Item);
            });
        } catch (err: unknown) {
            handleError(err);
            setLoading('Something went wrong :(');
        }
    };

    useEffect(() => {
        setItemById();
    }, [id]);

    useEffect(() => {
        if (item) {
            name.setNewValue(item.name);
            description.setNewValue(item.description);
            price.setNewValue(item.price.toString());
            instock.setNewValue(item.instock.toString());

            setSelectedCategories(
                item.categories.map((i) => {
                    return i.id;
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const changesMade = () => {
        return (
            item &&
            (item.name !== name.value ||
                item.description !== description.value ||
                item.price.toString() !== price.value.toString() ||
                item.instock.toString() !== instock.value.toString() ||
                categoriesChanged)
        );
    };

    const handleCategoryChange = (categoryId: number) => {
        setCategoriesChanged(true);

        const updatedCategories = [...selectedCategories];

        if (updatedCategories.includes(categoryId)) {
            const index = updatedCategories.indexOf(categoryId);
            updatedCategories.splice(index, 1);
        } else {
            updatedCategories.push(categoryId);
        }
        setSelectedCategories(updatedCategories);
    };

    const inputField = (input: UseField) => {
        return (
            <>
                <input type={input.type} value={input.value} onChange={input.onChange} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} />
            </>
        );
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (item && changesMade()) {
            if (usersState.loggedUser && usersState.loggedUser.token) {
                const token = usersState.loggedUser.token;

                const updatedItem = {
                    ...item,
                    name: name.value.toString(),
                    description: description.value.toString(),
                    price: Number(price.value),
                    instock: Number(instock.value),
                };

                // Add connections between the edited Item and the selected Categories that are not yet connected to the Item:
                selectedCategories.forEach(async (selected) => {
                    const category = categoriesState.find((c) => {
                        return c.id === selected;
                    });
                    if (category && item.categories.includes(category) === false) {
                        const res = await item_categoryService.addConnection(item, category, token);
                        if (!res.success) {
                            handleError(new Error(res.message));
                        }
                    }
                });

                // Remove connections between the edited Item and Categories that are currently connected to the Item:
                const toRemove = item.categories.filter((c) => {
                    if (selectedCategories.includes(c.id) === false) {
                        return c;
                    }
                });
                toRemove.forEach(async (c) => {
                    const res = await item_categoryService.deleteConnection(item.id, c.id, token);
                    if (!res.success) {
                        handleError(new Error(res.message));
                    } else {
                        console.log(res);
                    }
                });

                // Update the other info (name, description, etc):
                const res = await itemService.update(updatedItem, usersState.loggedUser.token, dispatch);

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

                setItemById();
            } else {
                handleError(new Error('Missing token'));
            }
        }
    };

    if (!item) {
        return (
            <>
                <br />
                <h4>{loading}</h4>
            </>
        );
    }

    return (
        <div>
            <form onSubmit={submit} className='adminFormItemEdit'>
                <table align='center' width={pageWidth}>
                    <tbody>
                        <tr>
                            <td className='adminHeader tight underlined'>
                                <h3>Admin Panel - Edit Item</h3>
                            </td>
                        </tr>
                        <tr style={{ padding: 0, height: '1rem' }}>
                            <td style={{ padding: 0 }}></td>
                        </tr>
                    </tbody>
                </table>
                <table align='center' width={pageWidth} className='itemDetails valignTop'>
                    <tbody>
                        <tr>
                            <td>
                                <table width='100%' className='padding150'>
                                    <tbody>
                                        <tr>
                                            <td className='adminItemEditLabel'>NAME:</td>
                                        </tr>
                                        <tr>
                                            <td>{inputField(name)}</td>
                                        </tr>
                                        <tr>
                                            <td className='adminItemEditLabel'>DESCRIPTION:</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <textarea value={description.value} onChange={description.onChange} style={{ width: '100%', height: '10rem' }}></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='adminItemEditLabel'>PRICE:</td>
                                        </tr>
                                        <tr>
                                            <td>{inputField(price)}</td>
                                        </tr>
                                        <tr>
                                            <td className='adminItemEditLabel'>IN STOCK:</td>
                                        </tr>
                                        <tr>
                                            <td className={item.instock > 0 ? 'itemInStock' : 'itemSoldOut'}>{inputField(instock)}</td>
                                        </tr>
                                        <tr>
                                            <td width='1px'>
                                                <button type='submit' disabled={!changesMade()}>
                                                    Save
                                                </button>
                                                &emsp;
                                                <BackButton type='button' />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td width='10%'></td>
                            <td width='40%' style={{ maxWidth: '40%' }}>
                                <table width='100%' className='padding150'>
                                    <tbody>
                                        <tr>
                                            <td className='adminItemEditLabel'>CATEGORIES:</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {categoriesState.map((c) => (
                                                    <button
                                                        key={c.id}
                                                        type='button'
                                                        className={'selectButton ' + (selectedCategories.includes(c.id) ? 'selectButtonTrue' : 'selectButtonFalse')}
                                                        onClick={() => handleCategoryChange(c.id)}
                                                    >
                                                        {c.name}
                                                    </button>
                                                ))}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='adminItemEditLabel'>IMAGES:</td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingBottom: 0 }}>
                                                <button type='button'>Upload image</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{item.images.length > 0 ? 'TODO' : 'No images'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default AdminItemEdit;

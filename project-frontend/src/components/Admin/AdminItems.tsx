import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Category, Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { handleError } from '../../util/handleError';
import itemService from '../../services/itemService';
import { langTextsToText } from '../../types/languageFunctions';
import { isNumber } from '../../types/typeFunctions';

import { setNotification } from '../../reducers/miscReducer';

import AdminItemRow from './AdminItemRow';
import AddItemForm from '../Admin/AddItemForm';
import { Link } from '../CustomLink';

const AdminItems = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.users);

    const [searchParams] = useSearchParams();

    const getCategoryFromParams = (): Category | undefined => {
        const id = Number(searchParams.get('category'));
        return id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;
    };

    const [category, setCategory] = useState<Category | undefined>(getCategoryFromParams());
    const [items, setItems] = useState<Item[]>([]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    return (
        <>
            <div>
                {categoryState.map((c) => (
                    <span key={c.id}>
                        <Link to={'/admin/items?category=' + c.id}>{langTextsToText(c.name, config)}</Link>
                        &emsp;<span className='colorGrayLight'>|</span>&emsp;
                    </span>
                ))}
                <Link to='/admin/items/'>Uncategorized</Link>
            </div>
            <br />
            <br />
            <h4>{category ? langTextsToText(category.name, config) : 'Uncategorized'}</h4>
            <p>{category ? langTextsToText(category.description, config) : 'Items that do not currently belong to any category'}</p>

            <table align='center' width='100%' className='sizeSmallish paddingTopBottomOnly dotted adminItems'>
                <tbody>
                    <tr className='bold'>
                        <td width='1px'>Product</td>
                        <td>Description</td>
                        <td width='1px'>Price</td>
                        <td width='1px' className='noWrap'>
                            In stock
                        </td>
                        <td width='1px'>ID</td>
                        <td width='1px'>Categ.</td>
                        <td width='1px' style={{ paddingLeft: 0 }}>
                            Images
                        </td>
                        <td width='1px' style={{ paddingRight: 0 }}></td>
                        <td width='1px'></td>
                    </tr>
                    {items.map((item) => (
                        <AdminItemRow key={item.id} item={item} deleteItem={deleteItem} />
                    ))}
                </tbody>
            </table>
            <br />
            <table width='100%'>
                <tbody>
                    <tr>
                        <td style={{ backgroundColor: 'var(--colorGrayVeryLight)', paddingLeft: '2rem', paddingRight: '2rem' }}>
                            <AddItemForm user={usersState.loggedUser} category={category} items={items} setItems={setItems} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
        </>
    );
};

export default AdminItems;

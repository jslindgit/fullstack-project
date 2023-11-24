import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Category, Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import itemService from '../../services/itemService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { isNumber } from '../../types/typeFunctions';

import { setNotification } from '../../reducers/miscReducer';

import AdminItemList from './AdminItemList';
import AddItemForm from '../Admin/AddItemForm';
import { Link } from '../CustomLink';
import { ContentID } from '../../content';

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
    const [uncategorizedItems, setUncategorizedItems] = useState<Item[]>([]);

    useEffect(() => {
        const getUncategorizedItems = async () => {
            const items = (await itemService.getAll()).filter((item) => item.categories.length === 0);
            setUncategorizedItems(items);
        };

        getUncategorizedItems();
    }, [items]);

    useEffect(() => {
        const id = Number(searchParams.get('category'));
        setCategory(id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined);
    }, [searchParams, categoryState]);

    const refreshItems = async () => {
        if (category) {
            setItems(category.items);
        } else {
            setItems(uncategorizedItems);
        }
    };

    useEffect(() => {
        refreshItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, uncategorizedItems]);

    const deleteItem = async (item: Item) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`${contentToText(ContentID.adminItemsDeleteItemConfirmation, config)} ${item.name}?`)) {
            const res = await itemService.deleteItem(item, usersState.loggedUser.token, config, dispatch);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

            refreshItems();
        }
    };

    return (
        <>
            <div>
                {categoryState.map((c) => (
                    <span key={c.id}>
                        <span className={category === c ? 'underlined' : ''}>
                            <Link to={'/admin/items?category=' + c.id}>
                                {langTextsToText(c.name, config)} ({c.items.length})
                            </Link>
                        </span>
                        <span className='colorGrayLight'>&emsp;|&emsp;</span>
                    </span>
                ))}
                <span className={category ? '' : 'underlined'}>
                    <Link to='/admin/items/'>
                        {contentToText(ContentID.adminItemsUncategorized, config)} ({uncategorizedItems.length})
                    </Link>
                </span>
            </div>
            <br />
            <br />
            <h4>{category ? langTextsToText(category.name, config) : contentToText(ContentID.adminItemsUncategorized, config)}</h4>
            <p>{category ? langTextsToText(category.description, config) : contentToText(ContentID.adminItemsUncategorizedDescription, config)}</p>
            <br />
            <AdminItemList config={config} deleteItem={deleteItem} items={items} />
            <br />
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

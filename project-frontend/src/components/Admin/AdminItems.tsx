import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Category, Item } from '../../types/types';

import itemService from '../../services/itemService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { isNumber } from '../../types/typeFunctions';

import { setNotification } from '../../reducers/miscReducer';

import AdminItemList from './AdminItemList';
import { Link } from '../CustomLink';
import ItemEditForm from './ItemEditForm';

const AdminItems = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const addItemButtonRef = useRef<HTMLButtonElement>(null);

    const [category, setCategory] = useState<Category | undefined>(undefined);
    const [itemAdded, setItemAdded] = useState<Item | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const previousScrollY = useRef<number>(0);
    const [scrollTo, setScrollTo] = useState<number>(0);
    const [showAddItem, setShowAddItem] = useState<boolean>(false);
    const [uncategorizedItems, setUncategorizedItems] = useState<Item[]>([]);

    const [searchParams] = useSearchParams();

    // Set Items that don't belong to any Category:
    useEffect(() => {
        const getUncategorizedItems = async () => {
            const allItems = (await itemService.getAll()).filter((item) => item.categories.length === 0);
            setUncategorizedItems(allItems);
        };

        getUncategorizedItems();
    }, []);

    // Get Category from URL param:
    useEffect(() => {
        const id = Number(searchParams.get('category'));
        setCategory(id && isNumber(id) ? categoryState.categories.find((c) => c.id === id) : undefined);
    }, [searchParams, categoryState]);

    // Fetch Items in the current Category:
    useEffect(() => {
        fetchItems();
    }, [category, uncategorizedItems]);

    // Scroll to "Add Item Form" if it's been opened:
    useEffect(() => {
        window.__forceSmoothScrollPolyfill__ = true;
        smoothscroll.polyfill();
        window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }, [scrollTo]);

    const closeAddItemForm = () => {
        setShowAddItem(false);
        setScrollTo(previousScrollY.current);
    };

    const deleteItem = async (item: Item) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`${contentToText(ContentID.adminItemsDeleteItemConfirmation, config)} "${langTextsToText(item.name, config)}"?`)) {
            const res = await itemService.deleteItem(item, usersState.loggedUser.token, config, dispatch);

            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));

            await fetchItems();
        }
    };

    const fetchItems = async () => {
        const source: Item[] = category ? category.items : uncategorizedItems;

        if (itemAdded && !source.includes(itemAdded)) {
            setItems([...source, itemAdded].sort());
        } else {
            setItems(source);

            if (itemAdded) {
                setItemAdded(null);
            }
        }
    };

    const handleAddItemButton = () => {
        setShowAddItem(true);

        if (addItemButtonRef.current) {
            const buttonRect = addItemButtonRef.current.getBoundingClientRect();
            previousScrollY.current = window.scrollY;
            setScrollTo(buttonRect.top + window.scrollY);
        }
    };

    return (
        <>
            <div>
                {categoryState.categories.map((c) => (
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
            <AdminItemList config={config} deleteItem={deleteItem} items={items} setItems={setItems} />
            <br />
            <br />
            <table width='100%'>
                <tbody>
                    <tr>
                        <td style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}>
                            {showAddItem ? (
                                <ItemEditForm
                                    config={config}
                                    initialCategories={category ? [category.id] : undefined}
                                    itemToEdit={null}
                                    onCancel={closeAddItemForm}
                                    onSubmit={() => {
                                        closeAddItemForm();
                                    }}
                                    setItemAdded={setItemAdded}
                                    width='100%'
                                />
                            ) : (
                                <button type='button' ref={addItemButtonRef} onClick={handleAddItemButton}>
                                    {contentToText(ContentID.adminAddNewItem, config)}
                                </button>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
        </>
    );
};

export default AdminItems;

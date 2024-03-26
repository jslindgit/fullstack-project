import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Category, Item } from '../../types/types';

import categoryService from '../../services/categoryService';
import itemService from '../../services/itemService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { isNumber } from '../../types/typeFunctions';

import { setNotification } from '../../reducers/miscReducer';

import AdminItemList from './AdminItemList';
import { Link } from '../CustomLink';
import ItemEditForm from './ItemEditForm';

const AdminItems = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const addItemButtonRef = useRef<HTMLButtonElement>(null);

    const [category, setCategory] = useState<Category | undefined>(undefined);
    const [categories, setCategories] = useState<Category[]>([]);
    const [itemAdded, setItemAdded] = useState<Item | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [scrollTo, setScrollTo] = useState<number>(0);
    const [showAddItem, setShowAddItem] = useState<boolean>(false);
    const [uncategorizedItems, setUncategorizedItems] = useState<Item[]>([]);

    const previousScrollY = useRef<number>(0);

    const [searchParams] = useSearchParams();

    // Fetch the categories from server:
    useEffect(() => {
        const fetch = async () => {
            const fetchedCategories = await categoryService.getAll();
            setCategories(fetchedCategories.sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))));
        };

        fetch();
    }, [config]);

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
        setCategory(id && isNumber(id) ? categories.find((c) => c.id === id) : undefined);
    }, [categories, searchParams]);

    // Fetch Items in the current Category:
    useEffect(() => {
        const fetchItems = async () => {
            const source: Item[] = category ? category.items : uncategorizedItems;
            setItems(source);
        };

        fetchItems();
    }, [category, uncategorizedItems]);

    // Scroll to "Add Item Form" if it's been opened:
    useEffect(() => {
        window.__forceSmoothScrollPolyfill__ = true;
        smoothscroll.polyfill();
        window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }, [scrollTo]);

    useEffect(() => {
        if (itemAdded && !items.includes(itemAdded)) {
            setItems([...items, itemAdded]);
            setItemAdded(null);
        }
    }, [itemAdded, items]);

    const closeAddItemForm = () => {
        setShowAddItem(false);
        setScrollTo(previousScrollY.current);
    };

    const deleteItem = async (item: Item) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`${contentToText(ContentID.adminItemsDeleteItemConfirmation, config)} "${langTextsToText(item.name, config)}"?`)) {
            const res = await itemService.deleteItem(item, usersState.loggedUser.token, config);

            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));

            if (res.success) {
                setItems(items.filter((i) => i !== item));
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
        <div className='grid-container marginBottom2' data-gap='2rem'>
            <div>
                {categories.map((c) => (
                    <span key={c.id}>
                        <span className={category?.id === c.id ? 'bold underlined' : ''}>
                            <Link to={'/admin/items?category=' + c.id}>{langTextsToText(c.name, config)}</Link>
                        </span>
                        <span className='bold colorGrayLight'>&emsp;|&emsp;</span>
                    </span>
                ))}
                <span className={category ? '' : 'underlined'}>
                    <Link to='/admin/items/'>{contentToText(ContentID.adminItemsUncategorized, config)}</Link>
                </span>
            </div>
            <div className='bold sizeLarge'>{category ? langTextsToText(category.name, config) : contentToText(ContentID.adminItemsUncategorized, config)}</div>
            <div className='marginTop-0_5'>
                {category ? langTextsToText(category.description, config) : contentToText(ContentID.adminItemsUncategorizedDescription, config)}
            </div>
            <AdminItemList config={config} deleteItem={deleteItem} items={items} />
            <div className='alignLeft'>
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
                    />
                ) : (
                    <button type='button' ref={addItemButtonRef} onClick={handleAddItemButton}>
                        + {contentToText(ContentID.adminAddNewItem, config)}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminItems;

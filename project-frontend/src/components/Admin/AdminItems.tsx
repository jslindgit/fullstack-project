import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';

import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';
import { Item } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { useCategoryGetAllQuery, useCategoryGetByIdQuery } from '../../redux/categorySlice';
import { useItemDeleteMutation, useItemGetAllQuery } from '../../redux/itemSlice';
import { setNotification } from '../../redux/miscReducer';

import AdminItemList from './AdminItemList';
import { Link } from '../CustomLink';
import ItemEditForm from './ItemEditForm';
import LoadingQuery from '../LoadingQuery';
import { isNumber } from '../../types/typeFunctions';

const AdminItems = () => {
    const [searchParams] = useSearchParams();

    const [categoryId, setCategoryId] = useState<number | null>(null);

    const categoryGetAll = useCategoryGetAllQuery();
    const categoryGetById = useCategoryGetByIdQuery(categoryId!, {
        skip: !categoryId,
    });
    const itemGetAll = useItemGetAllQuery();
    const [itemDelete] = useItemDeleteMutation();

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const addItemButtonRef = useRef<HTMLButtonElement>(null);

    const [items, setItems] = useState<Item[]>([]);
    const [scrollTo, setScrollTo] = useState<number>(0);
    const [showAddItem, setShowAddItem] = useState<boolean>(false);

    const previousScrollY = useRef<number>(0);

    // Scroll to "Add Item Form" if it's been opened:
    useEffect(() => {
        window.__forceSmoothScrollPolyfill__ = true;
        smoothscroll.polyfill();
        window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }, [scrollTo]);

    // Get Category id from URL param:
    useEffect(() => {
        if (searchParams.get('category')) {
            const id = Number(searchParams.get('category'));
            setCategoryId(isNumber(id) ? id : null);
        } else {
            setCategoryId(null);
        }
    }, [searchParams]);

    // Set Items:
    useEffect(() => {
        if (categoryId && categoryGetById.data) {
            setItems(categoryGetById.data.items);
        } else if (itemGetAll.data) {
            setItems(itemGetAll.data.filter((item) => item.categories.length < 1));
        }
    }, [categoryGetById.data, categoryId, itemGetAll.data]);

    const closeAddItemForm = () => {
        setShowAddItem(false);
        setScrollTo(previousScrollY.current);
    };

    const deleteItem = async (item: Item) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`${contentToText(ContentID.adminItemsDeleteItemConfirmation, config)} "${langTextsToText(item.name, config)}"?`)) {
            const res = await itemDelete({ toDelete: item, config: config }).unwrap();

            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));
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

    if (!categoryGetAll.data) {
        return <LoadingQuery query={categoryGetAll} config={config} />;
    }

    if (!itemGetAll.data) {
        return <LoadingQuery query={itemGetAll} config={config} />;
    }

    if (categoryId && !categoryGetById.data) {
        return <LoadingQuery query={categoryGetById} config={config} />;
    }

    return (
        <div className='grid-container marginBottom2' data-gap='2rem'>
            <div className='alignCenter flex-container' data-gap='1rem 2rem'>
                {[...categoryGetAll.data]
                    .sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config)))
                    .map((c) => (
                        <div key={c.id}>
                            <span className={categoryId === c.id ? 'underlined' : ''}>
                                <Link to={'/admin/items?category=' + c.id}>{langTextsToText(c.name, config)}</Link>
                            </span>
                        </div>
                    ))}
                <span className={categoryId ? '' : 'underlined'}>
                    <Link to='/admin/items/'>{contentToText(ContentID.adminItemsUncategorized, config)}</Link>
                </span>
            </div>
            <div className='bold sizeLarge'>
                {categoryGetById.data ? langTextsToText(categoryGetById.data.name, config) : contentToText(ContentID.adminItemsUncategorized, config)}
            </div>
            <div className='marginTop-0_5'>
                {categoryGetById.data
                    ? langTextsToText(categoryGetById.data.description, config)
                    : contentToText(ContentID.adminItemsUncategorizedDescription, config)}
            </div>
            <AdminItemList config={config} deleteItem={deleteItem} items={items} />
            <div className='alignLeft'>
                {showAddItem ? (
                    <ItemEditForm
                        config={config}
                        initialCategories={categoryId && categoryGetById.data ? [categoryGetById.data.id] : undefined}
                        itemToEdit={null}
                        onCancel={closeAddItemForm}
                        onSubmit={() => {
                            closeAddItemForm();
                        }}
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

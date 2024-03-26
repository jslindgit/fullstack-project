import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';

import { ContentID } from '../../content';
import { Category } from '../../types/types';

import categoryService from '../../services/categoryService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { setNotification } from '../../reducers/miscReducer';

import AddCategoryForm from './AddCategoryForm';
import { Link } from '../CustomLink';
import Loading from '../Loading';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    // Fetch the categories from server:
    useEffect(() => {
        const fetch = async () => {
            const fetchedCategories = await categoryService.getAll();
            setCategories(fetchedCategories.sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))));
            setLoaded(true);
        };

        fetch();
    }, [config]);

    const deleteCategory = async (category: Category) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`${contentToText(ContentID.adminDeleteCategory, config)} "${langTextsToText(category.name, config)}"?`)) {
            const res = await categoryService.deleteCategory(category, usersState.loggedUser.token, config);

            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));

            if (res.success) {
                setCategories([...categories].filter((c) => c.id !== category.id));
            }
        }
    };

    return (
        <div>
            {loaded ? (
                <>
                    <div className='grid-container left middle padded1rem preLine striped' data-cols='auto 1fr auto'>
                        <div className='bold gridStripedHeaderRow'>{contentToText(ContentID.miscName, config)}</div>
                        <div className='bold gridStripedHeaderRow'>{contentToText(ContentID.miscDescription, config)}</div>
                        <div className='gridStripedHeaderRow' />
                        {categories.map((c) => (
                            <React.Fragment key={c.id}>
                                <div className='semiBold'>{langTextsToText(c.name, config)}</div>
                                <div>{langTextsToText(c.description, config)}</div>
                                <div className='grid-container' data-cols='auto' data-gap='1rem'>
                                    <Link to={'/admin/editcategory/' + c.id}>
                                        <button type='button'>{contentToText(ContentID.buttonEditCategoryDetails, config)}</button>
                                    </Link>
                                    <Link to={`/admin/items?category=${c.id}&back=1`}>
                                        <button type='button'>{contentToText(ContentID.buttonEditCategoryProducts, config)}</button>
                                    </Link>
                                    <button
                                        className='red'
                                        onClick={() => deleteCategory(c)}
                                        disabled={!(usersState.loggedUser?.admin || (c.addedBy && c.addedBy === usersState.loggedUser?.id))}
                                        title={
                                            !(usersState.loggedUser?.admin || (c.addedBy && c.addedBy === usersState.loggedUser?.id))
                                                ? contentToText(ContentID.adminYouCanOnlyDeleteCategoriesAddedByYou, config)
                                                : ''
                                        }
                                    >
                                        {contentToText(ContentID.buttonRemove, config)}
                                    </button>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <br />
                    <AddCategoryForm categories={categories} setCategories={setCategories} user={usersState.loggedUser} />
                </>
            ) : (
                <Loading config={config} />
            )}
            <br />
        </div>
    );
};

export default AdminCategories;

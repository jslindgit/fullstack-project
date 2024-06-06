import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../redux/rootReducer';

import { ContentID } from '../../content';
import { Category } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { useCategoryDeleteMutation, useCategoryGetAllQuery } from '../../redux/categorySlice';
import { setNotification } from '../../redux/miscReducer';

import AddCategoryForm from './AddCategoryForm';
import { Link } from '../CustomLink';
import LoadingQuery from '../LoadingQuery';

const AdminCategories = () => {
    const [categoryDelete] = useCategoryDeleteMutation();
    const categoryGetAll = useCategoryGetAllQuery();

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const deleteCategory = async (category: Category) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`${contentToText(ContentID.adminDeleteCategory, config)} "${langTextsToText(category.name, config)}"?`)) {
            const res = await categoryDelete({ toDelete: category, config: config }).unwrap();

            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));
        }
    };

    const sortCategories = (categories: Category[]): Category[] => {
        return [...categories].sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config)));
    };

    if (!categoryGetAll.data) {
        return <LoadingQuery query={categoryGetAll} config={config} />;
    }

    return (
        <div>
            <div className='adminCategoriesList grid-container padded1remDeep left middle preLine striped' data-cols='auto 1fr auto'>
                <div className='bold gridStripedHeaderRow'>{contentToText(ContentID.miscName, config)}</div>
                <div className='bold gridStripedHeaderRow'>{contentToText(ContentID.miscDescription, config)}</div>
                <div className='gridStripedHeaderRow' />
                {sortCategories(categoryGetAll.data).map((c) => (
                    <React.Fragment key={c.id}>
                        <div className='buttonHighlight displayContents underlinedGridItem'>
                            <div className='semiBold'>{langTextsToText(c.name, config)}</div>
                            <div>{langTextsToText(c.description, config)}</div>
                            <div className='alignCenter grid-container' data-cols='admin-categories-buttons' data-gap='1rem'>
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
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <br />
            <AddCategoryForm user={usersState.loggedUser} />
            <br />
        </div>
    );
};

export default AdminCategories;

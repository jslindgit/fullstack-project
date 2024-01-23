import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';

import { ContentID } from '../../content';
import { Category } from '../../types/types';

import categoryService from '../../services/categoryService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { removeCategory } from '../../reducers/categoryReducer';
import { setNotification } from '../../reducers/miscReducer';

import AddCategoryForm from './AddCategoryForm';
import { Link } from '../CustomLink';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const deleteCategory = async (category: Category) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`${contentToText(ContentID.adminDeleteCategory, config)} "${langTextsToText(category.name, config)}"?`)) {
            const res = await categoryService.deleteCategory(category, usersState.loggedUser.token, config);

            dispatch(setNotification({ tone: res.success ? 'Neutral' : 'Negative', message: res.message }));

            if (res.success) {
                dispatch(removeCategory(category));
            }
        }
    };

    return (
        <div>
            <table className='dotted' width='100%'>
                <tbody>
                    <tr className='bold'>
                        <td>{contentToText(ContentID.miscName, config)}</td>
                        <td colSpan={4}>{contentToText(ContentID.miscDescription, config)}</td>
                    </tr>
                    {categoryState.categories.map((c) => (
                        <tr key={c.id}>
                            <td className='semiBold widthByContent'>{langTextsToText(c.name, config)}</td>
                            <td>{langTextsToText(c.description, config)}</td>
                            <td width='1px' style={{ paddingRight: 0 }}>
                                <Link to={'/admin/editcategory/' + c.id}>
                                    <button type='button'>{contentToText(ContentID.buttonEditCategoryDetails, config)}</button>
                                </Link>
                            </td>
                            <td width='1px' style={{ paddingRight: 0 }}>
                                <Link to={`/admin/items?category=${c.id}&back=1`}>
                                    <button type='button'>{contentToText(ContentID.buttonEditCategoryProducts, config)}</button>
                                </Link>
                            </td>
                            <td width='1px'>
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <AddCategoryForm user={usersState.loggedUser} />
            <br />
        </div>
    );
};

export default AdminCategories;

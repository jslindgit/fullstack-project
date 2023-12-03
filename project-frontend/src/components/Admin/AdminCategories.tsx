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

    if (!usersState.loggedUser?.admin) {
        return <>Error: 403</>;
    }

    const deleteCategory = async (category: Category) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`Delete category ${category.name}?`)) {
            const res = await categoryService.deleteCategory(category, usersState.loggedUser.token, config);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

            if (res.success) {
                dispatch(removeCategory(category));
            }
        }
    };

    return (
        <div>
            <table align='center' width='100%'>
                <tbody>
                    <tr>
                        <td style={{ padding: 0, paddingBottom: '1rem' }}>
                            <table className='dotted' width='100%'>
                                <tbody>
                                    <tr className='bold'>
                                        <td>{contentToText(ContentID.miscName, config)}</td>
                                        <td colSpan={4}>{contentToText(ContentID.miscDescription, config)}</td>
                                    </tr>
                                    {categoryState.map((c) => (
                                        <tr key={c.id}>
                                            <td width='1px' className='semiBold'>
                                                {langTextsToText(c.name, config)}
                                            </td>
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
                                                <button className='red' onClick={() => deleteCategory(c)}>
                                                    {contentToText(ContentID.buttonRemove, config)}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ backgroundColor: 'var(--colorGrayVeryLight)', paddingLeft: '2rem', paddingRight: '2rem' }}>
                            <AddCategoryForm user={usersState.loggedUser} />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminCategories;

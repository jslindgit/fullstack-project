import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';

import { Category } from '../../types/types';
import { Link } from '../CustomLink';

import categoryService from '../../services/categoryService';
import { langTextsToText } from '../../types/languageFunctions';

import { removeCategory } from '../../reducers/categoryReducer';
import { setNotification } from '../../reducers/miscReducer';

import AddCategoryForm from './AddCategoryForm';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.users);

    if (!usersState.loggedUser?.admin) {
        return <>Error: 403</>;
    }

    const deleteCategory = async (category: Category) => {
        if (!usersState.loggedUser) {
            return;
        }
        if (confirm(`Delete category ${category.name}?`)) {
            const res = await categoryService.deleteCategory(category, usersState.loggedUser.token);

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
                        <td style={{ paddingTop: 0 }}>
                            <table className='dotted' width='100%'>
                                <tbody>
                                    <tr className='bold'>
                                        <td>Name</td>
                                        <td>Description</td>
                                    </tr>
                                    {categoryState.map((c) => (
                                        <tr key={c.id}>
                                            <td className='widthByContent'>
                                                <Link to={'/admin/items?category=' + c.id}>{langTextsToText(c.name, config)}</Link>
                                            </td>
                                            <td>{langTextsToText(c.description, config)}</td>
                                            <td style={{ width: '1rem' }}></td>
                                            <td className='widthByContent'>
                                                <Link to={'/admin/editcategory/' + c.id}>
                                                    <button type='button'>Edit</button>
                                                </Link>
                                            </td>
                                            <td>
                                                <button className='red' onClick={() => deleteCategory(c)}>
                                                    Delete
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

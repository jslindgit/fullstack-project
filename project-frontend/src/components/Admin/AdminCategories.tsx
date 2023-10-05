import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';

import { Category } from '../../types/types';
import { Link } from '../CustomLink';

import categoryService from '../../services/categoryService';

import { removeCategory } from '../../reducers/categoryReducer';
import { setNotification } from '../../reducers/miscReducer';

import AddCategoryForm from './AddCategoryForm';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
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
            <table align='center' /*style={{ backgroundColor: '#5f5f5f' }}*/>
                <tbody>
                    <tr>
                        <td>
                            <table className='paddingTopBottomOnly'>
                                <tbody>
                                    {categoryState.map((c) => (
                                        <tr key={c.id}>
                                            <td>
                                                <Link to={'/admin/items?category=' + c.id}>{c.name}</Link>
                                            </td>
                                            <td>
                                                <button onClick={() => deleteCategory(c)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <AddCategoryForm user={usersState.loggedUser} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminCategories;

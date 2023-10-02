import { useSelector } from 'react-redux';

import { RootState } from '../../reducers/root_reducer';

import { Link } from '../CustomLink';

import AddCategoryForm from './AddCategoryForm';

const AdminCategories = () => {
    //const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.users);

    return (
        <div>
            <h2>Admin Panel - Categories</h2>
            <table>
                <tbody>
                    {categoryState.map((c) => (
                        <tr key={c.id}>
                            <td>
                                <Link to={'/admin/items/' + c.id}>{c.name}</Link>
                                &emsp;
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
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

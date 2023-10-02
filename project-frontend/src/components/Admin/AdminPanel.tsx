import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from '../../reducers/root_reducer';

import AdminCategories from './AdminCategories';
import AdminItems from './AdminItems';
import AdminMenu from './AdminMenu';
import AdminSettings from './AdminSettings';
import AdminUsers from './AdminUsers';

const AdminPanel = () => {
    const usersState = useSelector((state: RootState) => state.users);

    const page = useParams().page;

    const showPage = (): JSX.Element => {
        switch (page) {
            case 'categories':
                return <AdminCategories />;
            case 'items':
                return <AdminItems />;
            case 'settings':
                return <AdminSettings />;
            case 'users':
                return <AdminUsers />;
            default:
                return <h2>Admin Panel</h2>;
        }
    };

    if (!usersState.loggedUser?.admin) {
        return (
            <>
                <h2>Forbidden</h2>
            </>
        );
    }

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <AdminMenu />
                        </td>
                    </tr>
                    <tr>
                        <td>{showPage()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;

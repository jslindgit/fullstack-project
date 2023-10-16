import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from '../../reducers/rootReducer';

import { pageWidth } from '../../constants';

import AdminCategories from './AdminCategories';
import AdminImages from './AdminImages';
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
            case 'images':
                return <AdminImages />;
            case 'settings':
                return <AdminSettings />;
            case 'users':
                return <AdminUsers />;
            default:
                return <h2>Admin Panel</h2>;
        }
    };

    if (!usersState.loggedUser?.admin) {
        return <>Error: 403</>;
    }

    return (
        <div>
            <table align='center' width={pageWidth * 1.2} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td className='tight'>
                            <AdminMenu />
                        </td>
                    </tr>
                    <tr>
                        <td className='adminHeader tight underlined'>
                            <h3>Admin Panel{page && page.length > 0 ? ' - ' + page : ''}</h3>
                        </td>
                    </tr>
                    <tr>
                        <td className='tight'>{showPage()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;

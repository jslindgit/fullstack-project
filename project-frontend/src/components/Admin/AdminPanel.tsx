import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';

import { contentToText } from '../../types/languageFunctions';
import { pageWidth } from '../../constants';
import { printAdminPanelHeader } from '../../contentFunctions';

import AdminCategories from './AdminCategories';
import AdminImages from './AdminImages';
import AdminItems from './AdminItems';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import AdminUsers from './AdminUsers';
import BackButton from '../BackButton';

const AdminPanel = () => {
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.users);

    const page = useParams().page;

    const [searchParams] = useSearchParams();
    const back = searchParams.get('back');

    const showPage = (): JSX.Element => {
        switch (page) {
            case 'categories':
                return <AdminCategories />;
            case 'items':
                return <AdminItems />;
            case 'images':
                return <AdminImages />;
            case 'orders':
                return <AdminOrders />;
            case 'settings':
                return <AdminSettings />;
            case 'users':
                return <AdminUsers />;
            default:
                return <>Admin Panel</>;
        }
    };

    if (!usersState.loggedUser?.admin) {
        return <>Error: 403</>;
    }

    return (
        <div>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td colSpan={2} className='tight'>
                            <AdminMenu config={config} />
                        </td>
                    </tr>
                    <tr>
                        <td className='adminHeader pageHeader tight'>
                            {contentToText(ContentID.adminPanelHeader, config)}
                            {page && page.length > 0 ? ' - ' + printAdminPanelHeader(page, config) : ''}
                        </td>
                        <td className='alignRight'>{back && back === '1' ? <BackButton type='button' /> : <></>}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className='tight'>
                            {showPage()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;

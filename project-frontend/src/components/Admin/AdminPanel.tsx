import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';

import { contentToText } from '../../types/languageFunctions';

import AdminCategories from './AdminCategories';
import AdminItems from './AdminItems';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import AdminUsers from './AdminUsers';
import BackButton from '../BackButton';

const AdminPanel = () => {
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const page = useParams().page;

    const [searchParams] = useSearchParams();
    const back = searchParams.get('back');

    const printHeader = useCallback(
        (currentPage: string) => {
            switch (currentPage.toLowerCase()) {
                case 'categories':
                    return contentToText(ContentID.adminPanelCategories, config);
                case 'images':
                    return contentToText(ContentID.adminPanelImages, config);
                case 'items':
                    return contentToText(ContentID.adminPanelItems, config);
                case 'orders':
                    return contentToText(ContentID.adminPanelOrders, config);
                case 'settings':
                    return contentToText(ContentID.adminPanelSettings, config);
                case 'users':
                    return contentToText(ContentID.adminPanelUsers, config);
                default:
                    'N/A';
            }
        },
        [config]
    );

    useEffect(() => {
        if (!page || !['categories', 'items', 'orders', 'settings', 'users'].includes(page)) {
            navigate('/admin/orders');
        }
    }, [navigate, page]);

    // Title:
    useEffect(() => {
        document.title =
            contentToText(ContentID.adminPanelHeader, config) + (page && page.length > 0 ? ' - ' + printHeader(page) : ' | ' + config.store.contactName);
    }, [config, page, printHeader]);

    // User is Admin/Operator?
    useEffect(() => {
        if (miscState.loaded && !(usersState.loggedUser?.admin || usersState.loggedUser?.operator)) {
            navigate('/');
        }
    }, [miscState.loaded, navigate, usersState.loggedUser]);

    const showPage = (): JSX.Element => {
        switch (page) {
            case 'categories':
                return <AdminCategories />;
            case 'items':
                return <AdminItems />;
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

    return (
        <div>
            <div className='grid-container pageWidth' data-gap='1em'>
                <AdminMenu config={config} />
                <div className='grid-container pageHeader' data-cols='auto'>
                    {contentToText(ContentID.adminPanelHeader, config)}
                    {page && page.length > 0 ? ' - ' + printHeader(page) : ''}
                    {back === '1' && (
                        <div className='alignRight'>
                            <BackButton type='button' />
                        </div>
                    )}
                </div>
                <div>{showPage()}</div>
            </div>
        </div>
    );
};

export default AdminPanel;

import { useLocation } from 'react-router-dom';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';

import { contentToText } from '../../types/languageFunctions';

import { Link } from '../CustomLink';

interface Props {
    config: Config;
}

const AdminMenu = ({ config }: Props) => {
    const baseUrl = '/admin/';

    const currentPath = useLocation().pathname;

    const link = (page: string, contentId: ContentID) => (
        <div className={'semiBold' + ((page !== '' && currentPath.includes(page)) || (page === '' && currentPath === baseUrl) ? ' currentPage' : '')}>
            <Link to={baseUrl + page}>{contentToText(contentId, config)}</Link>
        </div>
    );

    return (
        <div className='divCenter divMinWidth grid-container marginTop1 sizeLarge' data-cols='auto' data-gap='3rem'>
            {link('orders', ContentID.adminPanelOrders)}
            {link('categories', ContentID.adminPanelCategories)}
            {link('items', ContentID.adminPanelItems)}
            {link('users', ContentID.adminPanelUsers)}
            {link('settings', ContentID.adminPanelSettings)}
        </div>
    );
};

export default AdminMenu;

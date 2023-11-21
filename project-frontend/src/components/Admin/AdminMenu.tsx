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

    const linkTd = (page: string, contentId: ContentID) => (
        <td className={(page !== '' && currentPath.includes(page)) || (page === '' && currentPath === baseUrl) ? 'currentPage' : ''}>
            <Link to={baseUrl + page}>{contentToText(contentId, config)}</Link>
        </td>
    );

    return (
        <div>
            <table align='center' className='sizeLarge'>
                <tbody>
                    <tr>
                        {linkTd('', ContentID.menuHome)}
                        {linkTd('orders', ContentID.adminPanelOrders)}
                        {linkTd('categories', ContentID.adminPanelCategories)}
                        {linkTd('items', ContentID.adminPanelItems)}
                        {linkTd('images', ContentID.adminPanelImages)}
                        {linkTd('users', ContentID.adminPanelUsers)}
                        {linkTd('settings', ContentID.adminPanelSettings)}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminMenu;

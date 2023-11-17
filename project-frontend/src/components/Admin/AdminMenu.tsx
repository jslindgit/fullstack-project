import { Config } from '../../types/types';
import { ContentID } from '../../content';

import { contentToText } from '../../types/languageFunctions';

import { Link } from '../CustomLink';

interface Props {
    config: Config;
}

const AdminMenu = ({ config }: Props) => {
    const baseUrl = '/admin/';

    return (
        <div>
            <table align='center' className='sizeLarge'>
                <tbody>
                    <tr>
                        <td>
                            <Link to={baseUrl}>{contentToText(ContentID.menuHome, config)}</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'orders'}>{contentToText(ContentID.adminPanelOrders, config)}</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'categories'}>{contentToText(ContentID.adminPanelCategories, config)}</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'items'}>{contentToText(ContentID.adminPanelItems, config)}</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'images'}>{contentToText(ContentID.adminPanelImages, config)}</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'users'}>{contentToText(ContentID.adminPanelUsers, config)}</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'settings'}>{contentToText(ContentID.adminPanelSettings, config)}</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminMenu;

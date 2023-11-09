import { Link } from '../CustomLink';

const AdminMenu = () => {
    const baseUrl = '/admin/';

    return (
        <div>
            <table align='center' className='sizeLarge'>
                <tbody>
                    <tr>
                        <td>
                            <Link to={baseUrl}>Panel</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'orders'}>Orders</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'categories'}>Categories</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'items'}>Items</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'images'}>Images</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'users'}>Users</Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'settings'}>Settings</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminMenu;

import { Link } from '../CustomLink';

const AdminMenu = () => {
    const baseUrl = '/admin/';

    return (
        <div>
            <table align='center'>
                <tbody>
                    <tr>
                        <td>
                            <Link to={baseUrl}>
                                <h3>Panel</h3>
                            </Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'categories'}>
                                <h3>Categories</h3>
                            </Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'items'}>
                                <h3>Items</h3>
                            </Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'users'}>
                                <h3>Users</h3>
                            </Link>
                        </td>
                        <td>
                            <Link to={baseUrl + 'settings'}>
                                <h3>Settings</h3>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminMenu;

import { Category } from '../types/types';

import { Link } from './CustomLink';

interface Props {
    categories: Category[];
}
const ItemsMenu = ({ categories }: Props) => {
    const baseUrl = '/shop/';

    return (
        <div>
            <table align='center' className='sizeLarge'>
                <tbody>
                    <tr>
                        <td>
                            <Link to={baseUrl}>Categories</Link>
                        </td>
                        {categories.map((c) => (
                            <td key={c.id}>
                                <Link to={baseUrl + c.id}>{c.name}</Link>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ItemsMenu;

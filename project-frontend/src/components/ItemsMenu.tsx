import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { Link } from './CustomLink';

const ItemsMenu = () => {
    const baseUrl = '/shop/';

    const categoryState = useSelector((state: RootState) => state.categories);

    return (
        <div>
            <table align='center' className='sizeLarge'>
                <tbody>
                    <tr>
                        <td>
                            <Link to={baseUrl}>Categories</Link>
                        </td>
                        {categoryState.map((c) => (
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

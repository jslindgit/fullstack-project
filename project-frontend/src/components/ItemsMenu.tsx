import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { Link } from './CustomLink';

interface Props {
    currentId: number;
}

const ItemsMenu = ({ currentId }: Props) => {
    const baseUrl = '/shop/';

    const categoryState = useSelector((state: RootState) => state.categories);

    return (
        <div>
            <table align='center' className='sizeLarge'>
                <tbody>
                    <tr>
                        {categoryState.map((c) => (
                            <td key={c.id} className={currentId === c.id ? 'currentPage semiBold' : ''}>
                                {currentId === c.id ? c.name : <Link to={baseUrl + c.id}>{c.name}</Link>}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ItemsMenu;

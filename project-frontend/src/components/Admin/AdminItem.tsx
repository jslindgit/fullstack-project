import { useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';

import { Link } from '../CustomLink';

interface Props {
    item: Item;
    deleteItem: (item: Item) => void;
}

const AdminItem = ({ item, deleteItem }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    const descriptionMaxLengthToShow = 300;

    return (
        <tr>
            <td>{item.name}</td>
            <td>{item.description.length > descriptionMaxLengthToShow ? item.description.substring(0, descriptionMaxLengthToShow - 1) + '...' : item.description}</td>
            <td className='noWrap'>{format.currency(item.price, configState)}</td>
            <td className='noWrap'>{item.instock} pcs</td>
            <td>{item.id}</td>
            <td>{item.categories ? item.categories.length.toString() : 0}</td>
            <td style={{ paddingRight: '0.75rem' }}>{item.images && item.images.length > 0 ? 'TODO' : 'No images'}</td>
            <td style={{ paddingRight: 0 }}>
                <Link to={'/admin/edititem/' + item.id}>
                    <button type='button' className='compactButton'>
                        Edit
                    </button>
                </Link>
            </td>
            <td>
                <button type='button' className='red compactButton' onClick={() => deleteItem(item)}>
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default AdminItem;

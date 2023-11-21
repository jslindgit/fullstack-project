import { useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { langTextsToText } from '../../types/languageFunctions';
import format from '../../util/format';

import AdminItemImageThumbsSmall from './AdminItemImageThumbsSmall';
import { Link } from '../CustomLink';

interface Props {
    item: Item;
    deleteItem: (item: Item) => void;
}

const AdminItemRow = ({ item, deleteItem }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const descriptionMaxLengthToShow = 300;
    const description = langTextsToText(item.description, config);

    return (
        <tr>
            <td width='1px'>{langTextsToText(item.name, config)}</td>
            <td>{description.length > descriptionMaxLengthToShow ? description.substring(0, descriptionMaxLengthToShow - 1) + '...' : description}</td>
            <td className='noWrap'>{format.currency(item.price, config)}</td>
            <td className='noWrap'>{item.instock} pcs</td>
            <td>{item.id}</td>
            <td>{item.categories ? item.categories.length.toString() : 0}</td>
            <td style={{ padding: 0 }}>
                <div className='imgFlex'>{item.images && item.images.length > 0 ? <AdminItemImageThumbsSmall images={item.images} /> : '-'}</div>
            </td>
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

export default AdminItemRow;

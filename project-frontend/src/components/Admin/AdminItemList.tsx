import { useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { langTextsToText } from '../../types/languageFunctions';
import format from '../../util/format';

import AdminItemImageThumbsSmall from './AdminItemImageThumbsSmall';
import { Link } from '../CustomLink';

interface RowProps {
    item: Item;
    deleteItem: (item: Item) => void;
}
const AdminItemRow = ({ item, deleteItem }: RowProps) => {
    const config = useSelector((state: RootState) => state.config);

    const descriptionMaxLengthToShow = 300;
    const description = langTextsToText(item.description, config);

    return (
        <tr>
            <td width='1px' className='semiBold'>
                {langTextsToText(item.name, config)}
            </td>
            <td>{description.length > descriptionMaxLengthToShow ? description.substring(0, descriptionMaxLengthToShow - 1) + '...' : description}</td>
            <td className='noWrap'>{format.currency(item.price, config)}</td>
            <td className='noWrap'>{item.instock} pcs</td>
            <td>{item.id}</td>
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
            <td style={{ paddingRight: '1rem' }}>
                <button type='button' className='red compactButton' onClick={() => deleteItem(item)}>
                    Delete
                </button>
            </td>
        </tr>
    );
};

interface ListProps {
    deleteItem: (item: Item) => Promise<void>;
    items: Item[];
}
const AdminItemList = ({ deleteItem, items }: ListProps) => {
    if (items.length < 1) {
        return <div className='alignCenter colorGraySemiDark semiBold sizeLarge'>No products in this category.</div>;
    }

    return (
        <table align='center' width='100%' className='headerRow sizeSmallish dotted adminItems'>
            <tbody>
                <tr className='bold'>
                    <td width='1px'>Product</td>
                    <td>Description</td>
                    <td width='1px'>Price</td>
                    <td width='1px' className='noWrap'>
                        In stock
                    </td>
                    <td width='1px'>ID</td>
                    <td width='1px' style={{ paddingLeft: 0 }}>
                        Images
                    </td>
                    <td width='1px' style={{ paddingRight: 0 }}></td>
                    <td width='1px' style={{ paddingRight: 0 }}></td>
                </tr>
                {items.map((item) => (
                    <AdminItemRow key={item.id} item={item} deleteItem={deleteItem} />
                ))}
            </tbody>
        </table>
    );
};

export default AdminItemList;

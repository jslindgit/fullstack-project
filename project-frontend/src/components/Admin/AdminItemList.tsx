import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Item } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
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
                        {contentToText(ContentID.buttonEdit, config)}
                    </button>
                </Link>
            </td>
            <td style={{ paddingRight: '1rem' }}>
                <button type='button' className='red compactButton' onClick={() => deleteItem(item)}>
                    {contentToText(ContentID.buttonRemove, config)}
                </button>
            </td>
        </tr>
    );
};

interface ListProps {
    config: Config;
    deleteItem: (item: Item) => Promise<void>;
    items: Item[];
}
const AdminItemList = ({ config, deleteItem, items }: ListProps) => {
    if (items.length < 1) {
        return <div className='alignCenter colorGrayDark semiBold sizeLarge'>{contentToText(ContentID.adminItemsNoProducts, config)}</div>;
    }

    return (
        <table align='center' width='100%' className='headerRow sizeSmallish dotted adminItems'>
            <tbody>
                <tr className='bold'>
                    <td width='1px'>{contentToText(ContentID.itemsItem, config)}</td>
                    <td>{contentToText(ContentID.miscDescription, config)}</td>
                    <td width='1px'>{contentToText(ContentID.itemsPrice, config)}</td>
                    <td width='1px' className='noWrap'>
                        {contentToText(ContentID.itemsInStock, config)}
                    </td>
                    <td width='1px'>{contentToText(ContentID.itemsId, config)}</td>
                    <td width='1px' style={{ paddingLeft: 0 }}>
                        {contentToText(ContentID.adminPanelImages, config)}
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

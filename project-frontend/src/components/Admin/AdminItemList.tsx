import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { Item } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';

import AdminItemRow from './AdminItemRow';

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
                    <td className='widthByContent'>{contentToText(ContentID.itemsInStock, config)}</td>
                    <td className='widthByContent'>{contentToText(ContentID.itemsId, config)}</td>
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

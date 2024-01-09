/* eslint-disable indent */
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Item } from '../../types/types';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { imageFilename, imageFullPath, itemInStockTotal } from '../../util/misc';

import { Link } from '../CustomLink';
import Image from '../Image';

interface Props {
    item: Item;
    deleteItem: (item: Item) => void;
}
const AdminItemRow = ({ item, deleteItem }: Props) => {
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const descriptionMaxLengthToShow = 300;
    const description = langTextsToText(item.description, config);

    return (
        <tr>
            <td className='semiBold widthByContent'>{langTextsToText(item.name, config)}</td>
            <td>{description.length > descriptionMaxLengthToShow ? description.substring(0, descriptionMaxLengthToShow - 1) + '...' : description}</td>
            <td className='noWrap'>{format.currency(item.price, config)}</td>
            <td className={'noWrap' + (itemInStockTotal(item) > 0 ? '' : ' colorRedLight')}>
                {itemInStockTotal(item)} {contentToText(ContentID.itemsPcs, config)}
            </td>
            <td>{item.id}</td>
            <td style={{ padding: 0 }}>
                <div className='imgFlex'>
                    {item.images && item.images.length > 0
                        ? item.images.map((img) => <Image key={img} className='imgAdminItems' src={imageFullPath(img)} title={imageFilename(img)} />)
                        : '-'}
                </div>
            </td>
            <td style={{ paddingRight: 0 }}>
                <Link to={'/admin/edititem/' + item.id}>
                    <button type='button' className='compactButton'>
                        {contentToText(ContentID.buttonEdit, config)}
                    </button>
                </Link>
            </td>
            <td style={{ paddingRight: '1rem' }}>
                <button
                    type='button'
                    className='red compactButton'
                    onClick={() => deleteItem(item)}
                    disabled={!(item.addedBy && item.addedBy === usersState.loggedUser?.id)}
                    title={
                        !(item.addedBy && item.addedBy === usersState.loggedUser?.id)
                            ? contentToText(ContentID.adminYouCanOnlyDeleteItemsAddedByYou, config)
                            : ''
                    }
                >
                    {contentToText(ContentID.buttonRemove, config)}
                </button>
            </td>
        </tr>
    );
};

export default AdminItemRow;

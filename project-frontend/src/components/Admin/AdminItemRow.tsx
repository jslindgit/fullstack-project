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

    const canEditAndDelete = () => usersState.loggedUser?.admin || (item.addedBy && item.addedBy === usersState.loggedUser?.id);

    return (
        <>
            <div className='semiBold underlinedGridItem'>{langTextsToText(item.name, config)}</div>
            <div className='underlinedGridItem'>
                {description.length > descriptionMaxLengthToShow ? description.substring(0, descriptionMaxLengthToShow - 1) + '...' : description}
            </div>
            <div className='noWrap underlinedGridItem'>{format.currency(item.price, config)}</div>
            <div className={'noWrap underlinedGridItem' + (itemInStockTotal(item) > 0 ? '' : ' colorRedLight')}>
                {itemInStockTotal(item)} {contentToText(ContentID.itemsPcs, config)}
            </div>
            <div className='underlinedGridItem'>{item.id}</div>
            <div className='padding0 underlinedGridItem'>
                <div className='imgFlex'>
                    {item.images && item.images.length > 0
                        ? item.images.map((img) => <Image key={img} className='imgAdminItems' src={imageFullPath(img)} title={imageFilename(img)} />)
                        : '-'}
                </div>
            </div>
            <div className='paddingRight0 underlinedGridItem'>
                <Link to={'/admin/edititem/' + item.id}>
                    <button
                        type='button'
                        className='compactButton'
                        disabled={!canEditAndDelete()}
                        title={!canEditAndDelete() ? contentToText(ContentID.adminYouCanOnlyEditItemsAddedByYou, config) : ''}
                    >
                        {contentToText(ContentID.buttonEdit, config)}
                    </button>
                </Link>
            </div>
            <div className='underlinedGridItem'>
                <button
                    type='button'
                    className='red compactButton'
                    onClick={() => deleteItem(item)}
                    disabled={!canEditAndDelete()}
                    title={!canEditAndDelete() ? contentToText(ContentID.adminYouCanOnlyDeleteItemsAddedByYou, config) : ''}
                >
                    {contentToText(ContentID.buttonRemove, config)}
                </button>
            </div>
        </>
    );
};

export default AdminItemRow;

import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';
import { Item } from '../../types/types';

import { testItemId } from '../../constants';
import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { imageFilename, itemInStockTotal } from '../../util/misc';

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

    // Item with id 89 is needed for E2E tests, so it can't be deleted/modified:
    const canEditAndDelete = () => item.id !== testItemId && (usersState.loggedUser?.admin || (item.addedBy && item.addedBy === usersState.loggedUser?.id));

    return (
        <>
            <div className='semiBold'>{langTextsToText(item.name, config)}</div>
            <div className='itemDetailsDescription'>
                {description.length > descriptionMaxLengthToShow ? description.substring(0, descriptionMaxLengthToShow - 1) + '...' : description}
            </div>
            <div className='noWrap'>{format.currency(item.price, config)}</div>
            <div className={'noWrap' + (itemInStockTotal(item) > 0 ? '' : ' colorRedLight')}>
                {itemInStockTotal(item)} {contentToText(ContentID.itemsPcs, config)}
            </div>
            <div>{item.id}</div>
            <div>
                <div className='imgFlex' data-gap='1rem'>
                    {item.images && item.images.length > 0
                        ? item.images.map((img) => <Image key={img} className='imgAdminItems' src={img} title={imageFilename(img)} />)
                        : '-'}
                </div>
            </div>
            <div className='grid-container' data-cols='admin-item-list-buttons' data-gap='admin-item-list-buttons'>
                <Link to={'/admin/edititem/' + item.id}>
                    <button
                        type='button'
                        className='compactButton'
                        disabled={!canEditAndDelete()}
                        // prettier-ignore
                        title={
                            !canEditAndDelete()
                                ? contentToText(
                                    item.id === testItemId ? ContentID.miscTestItemCannotBeModified : ContentID.adminYouCanOnlyEditItemsAddedByYou,
                                    config
                                )
                                : ''
                        }
                    >
                        {contentToText(ContentID.buttonEdit, config)}
                    </button>
                </Link>
                <button
                    type='button'
                    className='red compactButton'
                    onClick={() => deleteItem(item)}
                    disabled={!canEditAndDelete()}
                    // prettier-ignore
                    title={
                        !canEditAndDelete()
                            ? contentToText(
                                item.id === testItemId ? ContentID.miscTestItemCannotBeModified : ContentID.adminYouCanOnlyEditItemsAddedByYou,
                                config
                            )
                            : ''
                    }
                >
                    {contentToText(ContentID.buttonRemove, config)}
                </button>
            </div>
        </>
    );
};

export default AdminItemRow;

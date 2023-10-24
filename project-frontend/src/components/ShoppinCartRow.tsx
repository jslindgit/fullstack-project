import { useSelector } from 'react-redux';

import { Item, ShoppingItem } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { imageFullPath } from '../util/misc';

interface Props {
    item: Item;
    shoppingItem: ShoppingItem;
}

const ShoppingCartRow = ({ item, shoppingItem }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    const imagePath = item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <tr>
            <td width='1px'>
                <img src={imageFullPath(imagePath)} className='imgShoppingCart' />
            </td>
            <td>{item.name}</td>
            <td>{format.currency(item.price, configState)}</td>
            <td>{shoppingItem.quantity}</td>
            <td>{format.currency(item.price * shoppingItem.quantity, configState)}</td>
            <td width='1px'>
                <button type='button' className='compactButton red'>
                    Remove
                </button>
            </td>
        </tr>
    );
};

export default ShoppingCartRow;

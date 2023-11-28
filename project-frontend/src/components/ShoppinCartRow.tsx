import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../content';
import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';
import { ShoppingItem } from '../types/orderTypes';

import { refreshShoppingCartItemCount } from '../reducers/miscReducer';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import format from '../util/format';
import { imageFullPath } from '../util/misc';
import localstorageHandler from '../util/localstorageHandler';
import useField from '../hooks/useField';

interface Props {
    item: Item;
    shoppingItem: ShoppingItem;
    indexOf: number;
    removeItem: ((shoppingItem: number) => void) | null;
    allowEdit: boolean;
    fetchItems: () => Promise<void>;
}

const ShoppingCartRow = ({ item, shoppingItem, indexOf, removeItem, allowEdit, fetchItems }: Props) => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);

    const quantity = useField('integer', shoppingItem.quantity.toString());

    useEffect(() => {
        if (shoppingItem && shoppingItem.quantity && shoppingItem.quantity !== Number(quantity.value)) {
            localstorageHandler.updateShoppingCartItemQuantity(indexOf, Number(quantity.value));
            fetchItems();
            dispatch(refreshShoppingCartItemCount());
        }
    }, [quantity, fetchItems, indexOf, shoppingItem, dispatch]);

    const imagePath = item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <tr>
            <td width='1px'>
                <img src={imageFullPath(imagePath)} className='imgShoppingCart' />
            </td>
            <td>{langTextsToText(item.name, config)}</td>
            <td>{format.currency(item.price, config)}</td>
            <td>
                {allowEdit ? (
                    <input type={quantity.type} value={quantity.value} onChange={quantity.onChange} style={{ width: '5rem' }} />
                ) : (
                    shoppingItem.quantity
                )}
            </td>
            <td>{format.currency(item.price * shoppingItem.quantity, config)}</td>
            <td width='1px'>
                {allowEdit ? (
                    <button type='button' className='red' onClick={() => (removeItem ? removeItem(indexOf) : () => {})} disabled={!allowEdit}>
                        {contentToText(ContentID.buttonRemove, config)}
                    </button>
                ) : (
                    <></>
                )}
            </td>
        </tr>
    );
};

export default ShoppingCartRow;

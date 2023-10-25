import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Item, ShoppingItem } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { imageFullPath } from '../util/misc';
import localstorageHandler from '../util/localstorageHandler';
import useField from '../hooks/useField';

interface Props {
    item: Item;
    shoppingItem: ShoppingItem;
    indexOf: number;
    removeItem: (index: number) => void;
    allowEdit: boolean;
}

const ShoppingCartRow = ({ item, shoppingItem, indexOf, removeItem, allowEdit }: Props) => {
    console.log('shoppingItem:', shoppingItem);
    const configState = useSelector((state: RootState) => state.config);

    const quantity = useField('integer', shoppingItem.quantity.toString());

    useEffect(() => {
        //localstorageHandler.updateShoppingCartItemQuantity(indexOf, Number(quantity));
    }, [quantity, indexOf]);

    const imagePath = item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <tr>
            <td width='1px'>
                <img src={imageFullPath(imagePath)} className='imgShoppingCart' />
            </td>
            <td>{item.name}</td>
            <td>{format.currency(item.price, configState)}</td>
            <td>
                <input type={quantity.type} value={quantity.value} onChange={quantity.onChange} style={{ width: '5rem' }} />
            </td>
            <td>{format.currency(item.price * shoppingItem.quantity, configState)}</td>
            <td width='1px'>
                {allowEdit ? (
                    <button type='button' className='compactButton red' onClick={() => removeItem(indexOf)} disabled={!allowEdit}>
                        Remove
                    </button>
                ) : (
                    <></>
                )}
            </td>
        </tr>
    );
};

export default ShoppingCartRow;

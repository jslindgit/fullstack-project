import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../content';
import { ShoppingItem } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';
import { Item } from '../types/types';

import { updateShoppingCartItemQuantity } from '../reducers/orderReducer';

import format from '../util/format';
import itemService from '../services/itemService';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { imageFullPath } from '../util/misc';
import useField from '../hooks/useField';

interface Props {
    shoppingItem: ShoppingItem;
    indexOf: number;
    removeItem: ((shoppingItem: number) => void) | null;
    allowEdit: boolean;
}

const ShoppingCartRow = ({ shoppingItem, indexOf, removeItem, allowEdit }: Props) => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    const [item, setItem] = useState<Item | null>(null);

    const quantity = useField('integer', null, shoppingItem.quantity.toString());

    useEffect(() => {
        const fetchItem = async () => {
            setItem(await itemService.getById(shoppingItem.id));
        };

        fetchItem();
    }, [shoppingItem.id]);

    useEffect(() => {
        const quantityValue = Number(quantity.value);
        if (shoppingItem.quantity !== quantityValue) {
            if (quantityValue > 0 && quantityValue < 1000000) {
                dispatch(updateShoppingCartItemQuantity({ itemIndex: orderState.items.indexOf(shoppingItem), newQuantity: quantityValue }));
            } else {
                quantity.setNewValue(shoppingItem.quantity.toString());
            }
        }
    }, [quantity, indexOf, shoppingItem, dispatch]);

    const imagePath = item && item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <tr>
            <td width='1px'>
                <img src={imageFullPath(imagePath)} className='imgShoppingCart' />
            </td>
            <td>{item ? langTextsToText(item.name, config) : shoppingItem.name}</td>
            <td>{format.currency(shoppingItem.price, config)}</td>
            <td>
                {allowEdit ? (
                    <input type={quantity.type} value={quantity.value} onChange={quantity.onChange} style={{ width: '5rem' }} />
                ) : (
                    shoppingItem.quantity
                )}
            </td>
            <td>{format.currency(shoppingItem.price * shoppingItem.quantity, config)}</td>
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

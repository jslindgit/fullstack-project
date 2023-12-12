import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../content';
import { ShoppingItem } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';
import { Item } from '../types/types';

import format from '../util/format';
import itemService from '../services/itemService';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import useField from '../hooks/useField';

import { updateShoppingCartItemQuantity } from '../reducers/orderReducer';

import Image from './Image';

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

    // Fetch the Item matching the ShoppingItem from the server (unless it's 'id' is -1, meaning it's the order's DeliveryMethod, used in UserOrderHistory):
    useEffect(() => {
        if (shoppingItem.id >= 0) {
            const fetchItem = async () => {
                const fetchedItem = await itemService.getById(shoppingItem.id);
                setItem(fetchedItem);
            };

            fetchItem();
        }
    }, [shoppingItem]);

    // Adjust the quantity value, restricting it between 1 and max quantity (defined in Config):
    useEffect(() => {
        const quantityValue = Number(quantity.value);
        if (shoppingItem.quantity !== quantityValue) {
            if (quantityValue > 0 && quantityValue <= config.maxItemQuantity) {
                dispatch(updateShoppingCartItemQuantity({ itemIndex: orderState.items.indexOf(shoppingItem), newQuantity: quantityValue }));
            } else {
                quantity.setNewValue(shoppingItem.quantity.toString());
            }
        }
    }, [config.maxItemQuantity, dispatch, indexOf, orderState.items, quantity, shoppingItem]);

    const imagePath = item && item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <tr>
            <td width='1px'>{item ? <Image path={imagePath} className='imgShoppingCart' /> : ''}</td>
            <td className='normalWeight'>{item ? langTextsToText(item.name, config) : shoppingItem.name}</td>
            <td className='normalWeight'>{format.currency(shoppingItem.price, config)}</td>
            <td className='normalWeight'>
                {allowEdit ? (
                    <input type={quantity.type} value={quantity.value} onChange={quantity.onChange} style={{ width: '5rem' }} />
                ) : (
                    shoppingItem.quantity
                )}
            </td>
            <td className='normalWeight'>{format.currency(shoppingItem.price * shoppingItem.quantity, config)}</td>
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

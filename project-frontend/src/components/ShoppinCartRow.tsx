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

    // When quantity is adjusted with the "+" and "-" buttons:
    const adjustAmount = (adjustment: number) => {
        const newValue = Math.max(1, Math.min(Number(quantity.value) + adjustment, config.maxItemQuantity));
        if (shoppingItem.quantity !== newValue) {
            quantity.setNewValue(newValue.toString());
            dispatch(updateShoppingCartItemQuantity({ itemIndex: orderState.items.indexOf(shoppingItem), newQuantity: newValue }));
        }
    };

    // When quantity is adjusted by typing in the input field:
    useEffect(() => {
        const quantityValue = Math.max(1, Math.min(Number(quantity.value), config.maxItemQuantity));
        if (shoppingItem.quantity !== quantityValue) {
            quantity.setNewValue(quantityValue.toString());
            dispatch(updateShoppingCartItemQuantity({ itemIndex: orderState.items.indexOf(shoppingItem), newQuantity: quantityValue }));
        }
    }, [config.maxItemQuantity, dispatch, indexOf, orderState.items, quantity, shoppingItem]);

    const imagePath = item && item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <tr>
            <td width='1px'>{item ? <Image path={imagePath} className='imgShoppingCart' /> : ''}</td>
            <td className='normalWeight'>{item ? langTextsToText(item.name, config) : shoppingItem.name}</td>
            <td className='normalWeight'>{format.currency(shoppingItem.price, config)}</td>
            <td style={{ paddingLeft: 0 }}>
                <table className='nopadding'>
                    <tbody>
                        <tr>
                            <td className='normalWeight' style={{ paddingRight: 0 }}>
                                {allowEdit ? (
                                    <input type={quantity.type} value={quantity.value} onChange={quantity.onChange} style={{ width: '5rem' }} />
                                ) : (
                                    shoppingItem.quantity
                                )}
                            </td>
                            <td style={{ paddingBottom: 0, paddingLeft: 0, paddingTop: '0.4rem' }}>
                                <span className='adjustAmountButtons' onClick={() => adjustAmount(1)}>
                                    +
                                </span>
                                <br />
                                <span className='adjustAmountButtons' onClick={() => adjustAmount(-1)}>
                                    -
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
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

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { ShoppingItem } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';
import { Item } from '../../types/types';

import format from '../../util/format';
import itemService from '../../services/itemService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { imageFullPath } from '../../util/misc';
import useField from '../../hooks/useField';

import { updateShoppingCartItemQuantity } from '../../reducers/orderReducer';

import Image from '../Image';

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
        <React.Fragment>
            <div>{item ? <Image src={imageFullPath(imagePath)} className='imgShoppingCart' /> : ''}</div>
            <div className='grid-container' data-cols='1'>
                <div>{item ? langTextsToText(item.name, config) : shoppingItem.name}</div>
                {shoppingItem.size && shoppingItem.size.length > 0 && (
                    <div className='sizeSmallish'>
                        {contentToText(ContentID.itemsSize, config)}: {shoppingItem.size}
                    </div>
                )}
            </div>
            <div>{format.currency(shoppingItem.price, config)}</div>
            <div>
                <div className='grid-container middle' data-cols='2' style={{ width: 'min-content' }}>
                    <div>
                        {allowEdit ? (
                            <input type={quantity.type} value={quantity.value} onChange={quantity.onChange} style={{ width: '5rem' }} />
                        ) : (
                            <>
                                {shoppingItem.quantity} {contentToText(ContentID.itemsPcs, config)}
                            </>
                        )}
                    </div>
                    <div>
                        {allowEdit && (
                            <div style={{ marginTop: '0.65em' }}>
                                <div className='adjustAmountButtons' onClick={() => adjustAmount(1)}>
                                    +
                                </div>
                                <div className='adjustAmountButtons' onClick={() => adjustAmount(-1)}>
                                    -
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>{format.currency(shoppingItem.price * shoppingItem.quantity, config)}</div>
            <div>
                {allowEdit && (
                    <button type='button' className='red' onClick={() => (removeItem ? removeItem(indexOf) : () => {})} disabled={!allowEdit}>
                        {contentToText(ContentID.buttonRemove, config)}
                    </button>
                )}
            </div>
        </React.Fragment>
    );
};

export default ShoppingCartRow;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { ShoppingItem } from '../../types/orderTypes';
import { RootState } from '../../redux/rootReducer';
import { Item } from '../../types/types';

import format from '../../util/format';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';

import { useItemGetByIdQuery } from '../../redux/slices/itemSlice';
import { updateShoppingCartItemQuantity } from '../../redux/orderReducer';

import Image from '../Image';

interface Props {
    allowEdit: boolean;
    indexOf: number;
    narrowView: boolean;
    removeItem: ((shoppingItem: number) => void) | null;
    shoppingItem: ShoppingItem;
}

const ShoppingCartRow = ({ allowEdit, indexOf, narrowView, removeItem, shoppingItem }: Props) => {
    const itemGetById = useItemGetByIdQuery(shoppingItem.id, { skip: shoppingItem.id < 0 });

    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    const [item, setItem] = useState<Item | null>(null);

    const quantity = useField('integer', null, shoppingItem.quantity.toString());

    // Fetch the Item matching the ShoppingItem from the server (unless its 'id' is -1, meaning it's the order's DeliveryMethod, used in UserOrderHistory):
    useEffect(() => {
        if (shoppingItem.id >= 0 && itemGetById.data) {
            setItem(itemGetById.data);
        }
    }, [itemGetById.data, shoppingItem.id]);

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

    const ImageDiv = () => (
        <div>{item ? <Image src={item && item.images.length > 0 ? item.images[0] : '/no_image.png'} className='imgShoppingCart' /> : ''}</div>
    );

    const NameDiv = () => (
        <div className='grid-container' data-cols='1'>
            <div>{item ? langTextsToText(item.name, config) : shoppingItem.name}</div>
            {shoppingItem.size && shoppingItem.size.length > 0 && (
                <div className='sizeSmallish'>
                    {contentToText(ContentID.itemsSize, config)}: {shoppingItem.size}
                </div>
            )}
        </div>
    );

    const QuantityDiv = () => (
        <div>
            <div className='grid-container middle' data-cols='2'>
                <div>
                    {allowEdit ? (
                        <input className='width5rem' type={quantity.type} value={quantity.value} onChange={quantity.onChange} />
                    ) : (
                        <>
                            {shoppingItem.quantity} {contentToText(ContentID.itemsPcs, config)}
                        </>
                    )}
                </div>
                <div>
                    {allowEdit && (
                        <div className='marginTop0_5'>
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
    );

    const RemoveButtonDiv = () => (
        <div>
            {allowEdit && (
                <button type='button' className='red' onClick={() => (removeItem ? removeItem(indexOf) : () => {})} disabled={!allowEdit}>
                    {contentToText(ContentID.buttonRemove, config)}
                </button>
            )}
        </div>
    );

    return (
        <>
            {narrowView === false ? (
                <React.Fragment>
                    <ImageDiv />
                    <NameDiv />
                    <div>{format.currency(shoppingItem.price, config)}</div>
                    <QuantityDiv />
                    <div>{format.currency(shoppingItem.price * shoppingItem.quantity, config)}</div>
                    <RemoveButtonDiv />
                </React.Fragment>
            ) : (
                <div className='grid-container shoppingCartRowNarrow' data-cols='2' data-gap='1rem'>
                    <ImageDiv />
                    <NameDiv />
                    <div className='bold colorGray'>
                        {format.currency(shoppingItem.price, config)}/{contentToText(ContentID.itemsPcs, config)}
                    </div>
                    <QuantityDiv />
                    <RemoveButtonDiv />
                    <div className='bold'>{format.currency(shoppingItem.price * shoppingItem.quantity, config)}</div>
                </div>
            )}
        </>
    );
};

export default ShoppingCartRow;

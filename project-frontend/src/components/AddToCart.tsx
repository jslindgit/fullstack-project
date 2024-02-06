import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { ShoppingItem } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';
import { Item } from '../types/types';

import { availableSizes } from '../constants';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { itemInStockTotal } from '../util/misc';
import useField from '../hooks/useField';

import { setNotification } from '../reducers/miscReducer';
import { addItemToShoppingCart } from '../reducers/orderReducer';

interface Props {
    config: Config;
    item: Item;
}

const AddToCart = ({ config, item }: Props) => {
    const dispatch = useDispatch();
    const orderState = useSelector((state: RootState) => state.order);

    const [size, setSize] = useState<string>('');

    const quantity = useField('integer', ContentID.itemsAmount, '1');

    // When quantity is adjusted with the "+" and "-" buttons:
    const adjustAmount = (adjustment: number) => {
        const newValue = Math.max(1, Math.min(Number(quantity.value) + adjustment, config.maxItemQuantity)).toString();
        quantity.setNewValue(newValue);
    };

    // When quantity is adjusted by typing in the input field:
    useEffect(() => {
        const quantityValue = Math.max(1, Math.min(Number(quantity.value), config.maxItemQuantity));
        quantity.setNewValue(quantityValue.toString());
    }, [quantity, config.maxItemQuantity]);

    const handleAddToShoppingCart = (item: Item) => {
        const existingItem = orderState.items.find((si) => si.id === item.id && si.size === size);

        const quantityToAdd =
            existingItem && existingItem.quantity + Number(quantity.value) > config.maxItemQuantity
                ? config.maxItemQuantity - existingItem.quantity
                : Number(quantity.value);

        const shoppingItem: ShoppingItem = {
            id: item.id,
            name: langTextsToText(item.name, config),
            price: Number(item.price),
            quantity: quantityToAdd,
            size: size,
        };

        if (shoppingItem.quantity > 0) {
            dispatch(addItemToShoppingCart({ shoppingItem: shoppingItem, config: config }));

            dispatch(
                setNotification({
                    tone: 'Positive',
                    message: `${langTextsToText(item.name, config)} (${shoppingItem.quantity} ${contentToText(ContentID.itemsPcs, config)}) ${contentToText(
                        ContentID.itemsAddedToShoppingCart1,
                        config
                    )} ${contentToText(ContentID.itemsAddedToShoppingCart2, config)}.`,
                    linkText: contentToText(ContentID.itemsAddedToShoppingCart2, config),
                    linkTo: '/cart',
                })
            );

            quantity.setNewValue('1');
        } else {
            dispatch(
                setNotification({
                    tone: 'Neutral',
                    message: `${contentToText(ContentID.itemsMaximumAmountOfItemAlreadyInShoppingCart1, config)} ${langTextsToText(
                        item.name,
                        config
                    )} ${contentToText(ContentID.itemsMaximumAmountOfItemAlreadyInShoppingCart2, config)}`,
                })
            );
        }
    };

    const showSizeSelection = () => {
        return item && item.sizes.length > 1;
    };

    const sizeInStock = (): number => {
        if (item.sizes.length > 1) {
            const itemSize = item.sizes.find((s) => s.size === size);
            return itemSize ? itemSize.instock : 0;
        } else {
            return itemInStockTotal(item);
        }
    };

    const soldOutString = () => {
        if (showSizeSelection()) {
            return `${contentToText(ContentID.itemsSize, config)} ${size} ${contentToText(ContentID.miscIs, config)} ${contentToText(
                ContentID.miscUnfortunatelly,
                config
            )} ${contentToText(ContentID.itemsSoldOut, config).toLowerCase()}.`;
        } else {
            return contentToText(ContentID.itemsSoldOut, config);
        }
    };

    return (
        <div className='grid-container' data-gap='2rem'>
            {showSizeSelection() && (
                <div>
                    <div className='semiBold'>{contentToText(ContentID.itemsSize, config)}:</div>
                    <div style={{ marginTop: '0.5rem' }}>
                        <select value={size} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSize(event.target.value)}>
                            <option value='' disabled>
                                {contentToText(ContentID.itemsSelectSize, config)}
                            </option>
                            {[...item.sizes]
                                .sort((a, b) => availableSizes.indexOf(a.size) - availableSizes.indexOf(b.size))
                                .map((size) => (
                                    <option key={size.size} value={size.size}>
                                        {size.size} {size.instock > 0 ? '' : '(' + contentToText(ContentID.itemsSoldOut, config) + ')'}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            )}
            {(size.length > 0 || !showSizeSelection()) && (
                <div className={'semiBold ' + (sizeInStock() > 0 ? 'itemInStock' : 'itemSoldOut')}>
                    {
                        // prettier-ignore
                        sizeInStock() > 0
                            ? `${contentToText(ContentID.itemsInStock, config)} (${sizeInStock()} ${contentToText(
                                ContentID.itemsPcs,
                                config
                            )})`
                            : <>{soldOutString()}</>
                    }
                </div>
            )}
            {(sizeInStock() > 0 || (showSizeSelection() && size.length < 1)) && (
                <div>
                    <div className='semiBold'>{contentToText(quantity.label, config)}:</div>
                    <div className='grid-container valignMiddle' style={{ gridTemplateColumns: 'auto 1fr', marginTop: '0.5rem' }}>
                        <div>
                            <input
                                data-testid='item-quantity'
                                type={quantity.type}
                                value={quantity.value}
                                onChange={quantity.onChange}
                                style={{ width: '5rem' }}
                            />
                        </div>
                        <div>
                            <div data-testid='increase-quantity' className='adjustAmountButtons' onClick={() => adjustAmount(1)}>
                                +
                            </div>
                            <div className='adjustAmountButtons' onClick={() => adjustAmount(-1)} style={{ height: '1rem' }}>
                                -
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <button
                    data-testid='button-add-to-cart'
                    type='button'
                    onClick={() => handleAddToShoppingCart(item)}
                    disabled={sizeInStock() < 1 || Number(quantity.value) <= 0}
                >
                    {contentToText(
                        // prettier-ignore
                        sizeInStock() > 0
                            ? ContentID.itemsAddToShoppingCart
                            : showSizeSelection() && size.length < 1
                                ? ContentID.itemsSelectSize
                                : ContentID.itemsSoldOut,
                        config
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddToCart;

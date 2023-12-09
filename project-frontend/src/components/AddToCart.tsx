import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { ShoppingItem } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';
import { Item } from '../types/types';

import { setNotification } from '../reducers/miscReducer';
import { addItemToShoppingCart } from '../reducers/orderReducer';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import useField from '../hooks/useField';

interface Props {
    config: Config;
    item: Item;
}

const AddToCart = ({ config, item }: Props) => {
    const dispatch = useDispatch();
    const orderState = useSelector((state: RootState) => state.order);

    const quantity = useField('integer', ContentID.itemsAmount, '1');

    // When quantity is adjusted with the "+" and "-" buttons:
    const adjustAmount = (adjustment: number) => {
        quantity.setNewValue(Math.max(1, Math.min(Number(quantity.value) + adjustment, config.maxItemQuantity)).toString());
    };

    // When quantity is adjusted by typing in the input field:
    useEffect(() => {
        if (Number(quantity.value) < 1) {
            quantity.setNewValue('1');
        } else if (Number(quantity.value) > config.maxItemQuantity) {
            quantity.setNewValue(config.maxItemQuantity.toString());
        }
    }, [quantity, config.maxItemQuantity]);

    const handleAddToShoppingCart = (item: Item) => {
        const existingItem = orderState.items.find((si) => si.id === item.id);

        const quantityToAdd =
            existingItem && existingItem.quantity + Number(quantity.value) > config.maxItemQuantity
                ? config.maxItemQuantity - existingItem.quantity
                : Number(quantity.value);

        const shoppingItem: ShoppingItem = {
            id: item.id,
            name: langTextsToText(item.name, config),
            price: Number(item.price),
            quantity: quantityToAdd,
        };

        if (shoppingItem.quantity > 0) {
            dispatch(addItemToShoppingCart({ shoppingItem: shoppingItem, config: config }));

            dispatch(
                setNotification({
                    tone: 'Positive',
                    message: `${shoppingItem.quantity} x ${langTextsToText(item.name, config)} ${contentToText(
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

    return (
        <div>
            <b>{contentToText(quantity.label, config)}:</b>
            <br />
            <table className='noPadding'>
                <tbody>
                    <tr>
                        <td>
                            <input type={quantity.type} value={quantity.value} onChange={quantity.onChange} style={{ width: '5rem' }} />
                        </td>
                        <td style={{ paddingBottom: 0, paddingTop: '0.3rem' }}>
                            <span className='itemDetailsAdjustAmount' onClick={() => adjustAmount(1)}>
                                +
                            </span>
                            <br />
                            <span className='itemDetailsAdjustAmount' onClick={() => adjustAmount(-1)}>
                                -
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <button type='button' onClick={() => handleAddToShoppingCart(item)} disabled={item.instock <= 0 || Number(quantity.value) <= 0}>
                {contentToText(item.instock > 0 ? ContentID.itemsAddToShoppingCart : ContentID.itemsSoldOut, config)}
            </button>
        </div>
    );
};

export default AddToCart;

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Item, ShoppingItem } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { handleError } from '../util/handleError';
import itemService from '../services/itemService';
import localstorageHandler from '../util/localstorageHandler';
import { pageWidth } from '../constants';

import ShoppingCartRow from './ShoppinCartRow';

interface ItemPair {
    shoppingItem: ShoppingItem;
    item: Item;
}

const ShoppingCart = () => {
    const configState = useSelector((state: RootState) => state.config);

    const [items, setItems] = useState<ItemPair[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const shoppingItems = localstorageHandler.getShoppingCart();

            const itemPromises = shoppingItems.map(async (si) => {
                const item = await itemService.getById(si.itemId);
                if (item) {
                    return { shoppingItem: si, item: item };
                } else {
                    handleError(new Error(`Failed to fetch an Item with id ${si.itemId}!`));
                    return null;
                }
            });

            const resolvedItemPairs = await Promise.all(itemPromises);
            const filteredItemPairs = resolvedItemPairs.filter((pair) => pair !== null) as ItemPair[];
            setItems(filteredItemPairs);
        };

        fetchItems();
    }, []);

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Shopping Cart</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth} className='dotted'>
                <tbody>
                    <tr>
                        <td>Product</td>
                        <td></td>
                        <td>Unit price</td>
                        <td>Quantity</td>
                        <td>Total price</td>
                        <td></td>
                    </tr>
                    {items.map((itemPair) => (
                        <ShoppingCartRow key={itemPair.shoppingItem.itemId} item={itemPair.item} shoppingItem={itemPair.shoppingItem} />
                    ))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className='bold'>Total:</td>
                        <td className='bold'>
                            {format.currency(
                                items.reduce((total, itemPair) => total + itemPair.item.price * itemPair.shoppingItem.quantity, 0),
                                configState
                            )}
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ShoppingCart;

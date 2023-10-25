import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';
import { ShoppingItem } from '../types/orderTypes';

import { refreshShoppingCartItemCount } from '../reducers/miscReducer';

import format from '../util/format';
import { handleError } from '../util/handleError';
import itemService from '../services/itemService';
import localstorageHandler from '../util/localstorageHandler';
import { pageWidth } from '../constants';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import ShoppingCartRow from './ShoppinCartRow';

interface ItemPair {
    shoppingItem: ShoppingItem;
    item: Item;
}

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const configState = useSelector((state: RootState) => state.config);

    const [items, setItems] = useState<ItemPair[]>([]);

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

    useEffect(() => {
        fetchItems();
    }, []);

    const removeItem = useCallback(
        (index: number) => {
            if (window.confirm(`Remove ${items[index].item.name} from shopping cart?`)) {
                localstorageHandler.removeItemFromShoppingCart(index);
                fetchItems();
                dispatch(refreshShoppingCartItemCount());
            }
        },
        [items, dispatch]
    );

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Shopping cart</h3>
                        </td>
                    </tr>
                    {items.length <= 0 ? (
                        <tr>
                            <td>Shopping cart is empty</td>
                        </tr>
                    ) : (
                        ''
                    )}
                </tbody>
            </table>
            <table align='center' width={pageWidth} className='dotted'>
                <tbody>
                    {items.length > 0 ? (
                        <>
                            <tr>
                                <td>Product</td>
                                <td></td>
                                <td>Unit price</td>
                                <td>Quantity</td>
                                <td>Total price</td>
                                <td></td>
                            </tr>
                            {items.map((itemPair) => (
                                <ShoppingCartRow
                                    key={itemPair.shoppingItem.itemId}
                                    item={itemPair.item}
                                    shoppingItem={itemPair.shoppingItem}
                                    indexOf={items.indexOf(itemPair)}
                                    removeItem={removeItem}
                                    allowEdit={true}
                                    fetchItems={fetchItems}
                                />
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
                        </>
                    ) : (
                        <></>
                    )}
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='text' />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                            {items.length > 0 ? (
                                <Link to='/checkout'>
                                    <button type='button' className='sizeVeryLarge'>
                                        Check out →
                                    </button>
                                </Link>
                            ) : (
                                <></>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ShoppingCart;

import { useSelector } from 'react-redux';

import { ItemPair } from './ShoppinCart';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { itemsTotalSum } from '../util/checkoutProvider';

import ShoppingCartRow from './ShoppinCartRow';

interface Props {
    allowEdit: boolean;
    fetchItems: () => Promise<void>;
    items: ItemPair[];
    removeItem: ((shoppingItem: number) => void) | null;
    width: number;
}

const ShoppingCartContent = ({ allowEdit, fetchItems, items, removeItem, width }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    if (items.length <= 0) {
        return (
            <table align='center' width={width}>
                <tbody>
                    <tr>
                        <td>Shopping cart is empty.</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    return (
        <table align='center' width={width} className='dotted'>
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
                                allowEdit={allowEdit}
                                fetchItems={fetchItems}
                            />
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className='bold'>Total:</td>
                            <td className='bold'>{format.currency(itemsTotalSum(items.map((itemPair) => itemPair.shoppingItem)), configState)}</td>
                            <td></td>
                        </tr>
                    </>
                ) : (
                    <></>
                )}
            </tbody>
        </table>
    );
};

export default ShoppingCartContent;

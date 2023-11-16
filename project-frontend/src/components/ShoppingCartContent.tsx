import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { ItemPair } from './ShoppinCart';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
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
    const config = useSelector((state: RootState) => state.config);

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
                        <tr className='semiBold' style={{ backgroundColor: 'var(--colorGrayVeryLight)' }}>
                            <td colSpan={2}>{contentToText(ContentID.cartProduct, config)}</td>
                            <td>{contentToText(ContentID.cartUnitPrice, config)}</td>
                            <td>{contentToText(ContentID.cartQuantity, config)}</td>
                            <td>{contentToText(ContentID.cartTotalPrice, config)}</td>
                            <td></td>
                        </tr>
                        {items.map((itemPair) => (
                            <ShoppingCartRow
                                key={itemPair.shoppingItem.id}
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
                            <td className='semiBold'>{contentToText(ContentID.cartSubtotal, config)}:</td>
                            <td className='semiBold'>{format.currency(itemsTotalSum(items.map((itemPair) => itemPair.shoppingItem)), config)}</td>
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

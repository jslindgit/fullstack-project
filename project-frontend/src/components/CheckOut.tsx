import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Item, ShoppingItem } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { handleError } from '../util/handleError';
import itemService from '../services/itemService';
import localstorageHandler from '../util/localstorageHandler';
import { pageWidth } from '../constants';
import useField, { UseField } from '../hooks/useField';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import ShoppingCartRow from './ShoppinCartRow';

interface ItemPair {
    shoppingItem: ShoppingItem;
    item: Item;
}

const CheckOut = () => {
    const configState = useSelector((state: RootState) => state.config);

    const [items, setItems] = useState<ItemPair[]>([]);

    const name = useField('text', '');
    const organization = useField('text', '');
    const address = useField('text', '');
    const zipcode = useField('text', '');
    const city = useField('text', '');
    const email = useField('text', '');
    const phone = useField('text', '');

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

    const inputField = (label: string, field: UseField) => (
        <>
            <tr>
                <td className='widthByContent'>{label}:</td>
                <td>
                    <input type={field.type} value={field.value} onChange={field.onChange} />
                </td>
            </tr>
        </>
    );

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Check out</h3>
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
                                    removeItem={null}
                                    allowEdit={false}
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
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3>Customer Contact Information</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    {inputField('Name', name)}
                    {inputField('Organization (optional)', organization)}
                    {inputField('Street adress', address)}
                    {inputField('Zipcode', zipcode)}
                    {inputField('City', city)}
                    {inputField('E-mail', email)}
                    {inputField('Phone', phone)}
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='text' />
                        </td>
                        <td className='sizeVeryLarge' style={{ textAlign: 'right' }}>
                            <Link to='/checkout'>Payment →</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOut;

import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { ShoppingItem } from '../types/orderTypes';
import { RootState } from '../reducers/rootReducer';

import { itemsTotalSum } from '../util/checkoutProvider';
import format from '../util/format';
import { contentToText } from '../types/languageFunctions';

import ShoppingCartRow from './ShoppinCartRow';

interface Props {
    allowEdit: boolean;
    shoppingItems: ShoppingItem[];
    removeItem: ((shoppingItem: number) => void) | null;
    width: number;
}

const ShoppingCartContent = ({ allowEdit, shoppingItems, removeItem, width }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    if (shoppingItems.length <= 0) {
        return (
            <table align='center' width={width}>
                <tbody>
                    <tr>
                        <td style={{ paddingBottom: '1.2em', paddingLeft: 0 }}>{contentToText(ContentID.cartIsEmpty, config)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    return (
        <table align='center' width={width} className='dotted'>
            <tbody>
                {shoppingItems.length > 0 ? (
                    <>
                        <tr className='semiBold' style={{ backgroundColor: 'var(--colorGrayVeryLight)' }}>
                            <td colSpan={2}>{contentToText(ContentID.cartProduct, config)}</td>
                            <td>{contentToText(ContentID.cartUnitPrice, config)}</td>
                            <td>{contentToText(ContentID.cartQuantity, config)}</td>
                            <td>{contentToText(ContentID.cartTotalPrice, config)}</td>
                            <td></td>
                        </tr>
                        {shoppingItems.map((shoppingItem) => (
                            <ShoppingCartRow
                                key={shoppingItem.id}
                                shoppingItem={shoppingItem}
                                indexOf={shoppingItems.indexOf(shoppingItem)}
                                removeItem={removeItem}
                                allowEdit={allowEdit}
                            />
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className='semiBold'>{contentToText(ContentID.cartSubtotal, config)}:</td>
                            <td className='semiBold'>{format.currency(itemsTotalSum(shoppingItems.map((shoppingItem) => shoppingItem)), config)}</td>
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

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
    removeItem: ((shoppingItem: number) => void) | null;
    shoppingItems: ShoppingItem[];
    totalSumContentID?: ContentID;
    width: number | string;
}

const ShoppingCartContent = ({ allowEdit, shoppingItems, removeItem, totalSumContentID = ContentID.cartSubtotal, width }: Props) => {
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
                        <tr className='semiBold'>
                            <td colSpan={2} className='bgColorGrayVeryLightImportant'>
                                {contentToText(ContentID.cartProduct, config)}
                            </td>
                            <td className='bgColorGrayVeryLightImportant'>{contentToText(ContentID.cartUnitPrice, config)}</td>
                            <td className='bgColorGrayVeryLightImportant'>{contentToText(ContentID.cartQuantity, config)}</td>
                            <td className='bgColorGrayVeryLightImportant'>{contentToText(ContentID.cartTotalPrice, config)}</td>
                            <td className='bgColorGrayVeryLightImportant'></td>
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
                            <td className='semiBold'>{contentToText(totalSumContentID, config)}:</td>
                            <td className='bold'>{format.currency(itemsTotalSum(shoppingItems.map((shoppingItem) => shoppingItem)), config)}</td>
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

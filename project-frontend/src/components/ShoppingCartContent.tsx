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

    if (shoppingItems.length < 1) {
        return <></>;
    }

    return (
        <div className='dotted' style={{ margin: 'auto', width: width }}>
            <div className='grid-container left middle padded1rem striped' style={{ gridTemplateColumns: 'auto 1fr auto 1fr auto auto' }}>
                <div className='gridStripedHeaderRow gridSpan2'>{contentToText(ContentID.cartProduct, config)}</div>
                <div className='gridStripedHeaderRow'>{contentToText(ContentID.cartUnitPrice, config)}</div>
                <div className='gridStripedHeaderRow'>{contentToText(ContentID.cartQuantity, config)}</div>
                <div className='gridStripedHeaderRow gridSpan2'>{contentToText(ContentID.cartTotalPrice, config)}</div>
                {shoppingItems.map((shoppingItem) => (
                    <ShoppingCartRow
                        key={shoppingItem.id + shoppingItem.size}
                        shoppingItem={shoppingItem}
                        indexOf={shoppingItems.indexOf(shoppingItem)}
                        removeItem={removeItem}
                        allowEdit={allowEdit}
                    />
                ))}
                <div className='gridSpan3' />
                <div className='semiBold'>{contentToText(totalSumContentID, config)}:</div>
                <div className='bold gridSpan2'>{format.currency(itemsTotalSum(shoppingItems.map((shoppingItem) => shoppingItem)), config)}</div>
            </div>
        </div>
    );
};

export default ShoppingCartContent;

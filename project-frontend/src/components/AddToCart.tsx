import { useDispatch } from 'react-redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { ShoppingItem } from '../types/orderTypes';
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

    const amount = useField('integer', ContentID.itemsAmount, '1');

    const adjustAmount = (adjustment: number) => {
        amount.setNewValue(Math.max(0, Math.min(Number(amount.value) + adjustment, 1000)).toString());
    };

    const handleAddToShoppingCart = (item: Item) => {
        const shoppingItem: ShoppingItem = { id: item.id, name: langTextsToText(item.name, config), price: Number(item.price), quantity: Number(amount.value) };
        dispatch(addItemToShoppingCart(shoppingItem));

        dispatch(
            setNotification({
                tone: 'Positive',
                message: `${amount.value} x ${langTextsToText(item.name, config)} ${contentToText(ContentID.itemsAddedToShoppingCart1, config)} ${contentToText(
                    ContentID.itemsAddedToShoppingCart2,
                    config
                )}.`,
                linkText: contentToText(ContentID.itemsAddedToShoppingCart2, config),
                linkTo: '/cart',
            })
        );

        amount.setNewValue('1');
    };

    return (
        <div>
            <b>{contentToText(amount.label, config)}:</b>
            <br />
            <table className='noPadding'>
                <tbody>
                    <tr>
                        <td>
                            <input type={amount.type} value={amount.value} onChange={amount.onChange} style={{ width: '5rem' }} />
                        </td>
                        <td style={{ paddingTop: '0.2rem' }}>
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
            <button type='button' onClick={() => handleAddToShoppingCart(item)} disabled={item.instock <= 0 || Number(amount.value) <= 0}>
                {contentToText(item.instock > 0 ? ContentID.itemsAddToShoppingCart : ContentID.itemsSoldOut, config)}
            </button>
        </div>
    );
};

export default AddToCart;

import { useDispatch } from 'react-redux';

import { Item } from '../types/types';

import { refreshShoppingCartItemCount, setNotification } from '../reducers/miscReducer';

import localstorageHandler from '../util/localstorageHandler';
import useField from '../hooks/useField';

interface Props {
    item: Item;
}

const AddToCart = ({ item }: Props) => {
    const dispatch = useDispatch();

    const amount = useField('integer', '1');

    const adjustAmount = (adjustment: number) => {
        amount.setNewValue(Math.max(0, Math.min(Number(amount.value) + adjustment, 1000)).toString());
    };

    const handleAddToShoppingCart = (item: Item) => {
        localstorageHandler.addToShoppingCart(item, Number(amount.value));

        dispatch(refreshShoppingCartItemCount());
        dispatch(setNotification({ tone: 'Positive', message: `${amount.value} x ${item.name} added to shopping cart.` }));

        amount.setNewValue('0');
    };

    return (
        <div>
            <b>Amount:</b>
            <br />
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
                {item.instock > 0 ? 'Add to shopping cart' : 'Sold out'}
            </button>
        </div>
    );
};

export default AddToCart;

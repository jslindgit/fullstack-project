import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Item } from '../types/types';
import { ShoppingItem } from '../types/orderTypes';

import { refreshShoppingCartItemCount } from '../reducers/miscReducer';

import { fetchItems } from '../util/checkoutProvider';
import localstorageHandler from '../util/localstorageHandler';
import { pageWidth } from '../constants';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import ShoppingCartContent from './ShoppingCartContent';

export interface ItemPair {
    shoppingItem: ShoppingItem;
    item: Item;
}

const ShoppingCart = () => {
    const dispatch = useDispatch();

    const [items, setItems] = useState<ItemPair[]>([]);

    const fetch = async () => {
        setItems(await fetchItems());
    };

    useEffect(() => {
        fetch();
    }, []);

    const removeItem = (index: number) => {
        if (window.confirm(`Remove ${items[index].item.name} from shopping cart?`)) {
            localstorageHandler.removeItemFromShoppingCart(index);
            fetch();
            dispatch(refreshShoppingCartItemCount());
        }
    };

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Shopping cart</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <ShoppingCartContent allowEdit={true} fetchItems={fetch} items={items} removeItem={removeItem} width={pageWidth} />
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

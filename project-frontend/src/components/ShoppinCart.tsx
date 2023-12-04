import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { removeItemFromShoppingCart } from '../reducers/orderReducer';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import ShoppingCartContent from './ShoppingCartContent';

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    const removeItem = (index: number) => {
        if (window.confirm(`Remove ${orderState.items[index].name} from shopping cart?`)) {
            dispatch(removeItemFromShoppingCart(orderState.items[index]));
        }
    };

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.menuShoppingCart, config)}</td>
                    </tr>
                </tbody>
            </table>
            <ShoppingCartContent allowEdit={true} shoppingItems={orderState.items} removeItem={removeItem} width={pageWidth} />
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td style={{ paddingLeft: 0 }}>
                            <BackButton type='text' />
                        </td>
                        <td style={{ paddingRight: 0, textAlign: 'right' }}>
                            {orderState.items.length > 0 ? (
                                <Link to='/checkout'>
                                    <button type='button' className='large'>
                                        {contentToText(ContentID.buttonCheckOut, config)} →
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

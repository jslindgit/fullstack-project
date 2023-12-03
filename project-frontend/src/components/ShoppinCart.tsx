import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { removeItemFromShoppingCart } from '../reducers/shoppingCartReducer';

import { pageWidth } from '../constants';
import { contentToText } from '../types/languageFunctions';

import BackButton from './BackButton';
import { Link } from './CustomLink';
import ShoppingCartContent from './ShoppingCartContent';

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const shoppingCartState = useSelector((state: RootState) => state.shoppingCart);

    const removeItem = (index: number) => {
        if (window.confirm(`Remove ${shoppingCartState.shoppingItems[index].name} from shopping cart?`)) {
            dispatch(removeItemFromShoppingCart(shoppingCartState.shoppingItems[index]));
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
            <ShoppingCartContent allowEdit={true} shoppingItems={shoppingCartState.shoppingItems} removeItem={removeItem} width={pageWidth} />
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td style={{ paddingLeft: 0 }}>
                            <BackButton type='text' />
                        </td>
                        <td style={{ paddingRight: 0, textAlign: 'right' }}>
                            {shoppingCartState.shoppingItems.length > 0 ? (
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

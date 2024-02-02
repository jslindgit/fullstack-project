import { useEffect } from 'react';
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

    useEffect(() => {
        document.title = contentToText(ContentID.menuShoppingCart, config) + ' | ' + config.store.contactName;
    }, [config]);

    const removeItem = (index: number) => {
        if (window.confirm(`Remove ${orderState.items[index].name} from shopping cart?`)) {
            dispatch(removeItemFromShoppingCart(orderState.items[index]));
        }
    };

    return (
        <div className='pageWidth'>
            <div data-testid='cart-header' className='pageHeader'>
                {contentToText(ContentID.menuShoppingCart, config)}
            </div>
            <ShoppingCartContent allowEdit={true} shoppingItems={orderState.items} removeItem={removeItem} width={pageWidth} />
            <div className='grid-container' data-cols='2' style={{ marginBottom: '2rem', marginTop: '2rem' }}>
                <div className='alignLeft valignMiddle'>
                    <BackButton type='text' />
                </div>
                <div className='alignRight'>
                    {orderState.items.length > 0 && (
                        <Link to='/checkout'>
                            <button type='button' className='large'>
                                {contentToText(ContentID.buttonCheckOut, config)} →
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;

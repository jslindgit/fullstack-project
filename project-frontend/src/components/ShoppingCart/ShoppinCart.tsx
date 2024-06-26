import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';

import { removeItemFromShoppingCart } from '../../redux/orderReducer';

import { contentToText } from '../../types/languageFunctions';

import BackButton from '../BackButton';
import { Link } from '../CustomLink';
import ShoppingCartContent from './ShoppingCartContent';

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    // Page title:
    useEffect(() => {
        document.title = contentToText(ContentID.menuShoppingCart, config) + ' | ' + config.store.contactName;
    }, [config]);

    const removeItem = (index: number) => {
        if (window.confirm(contentToText(ContentID.cartRemoveItemConfirmation, config).replace('<item name>', orderState.items[index].name))) {
            dispatch(removeItemFromShoppingCart(orderState.items[index]));
        }
    };

    return (
        <div className='pageWidth'>
            <div data-testid='cart-header' className='pageHeader'>
                {contentToText(ContentID.menuShoppingCart, config)}
            </div>
            <ShoppingCartContent allowEdit={true} shoppingItems={orderState.items} removeItem={removeItem} />
            <div className='grid-container marginBottom2 marginTop2' data-cols='2'>
                <div className='alignLeft valignMiddle'>
                    <BackButton type='text' />
                </div>
                <div className='alignRight'>
                    {orderState.items.length > 0 && (
                        <Link to='/checkout'>
                            <button data-testid='button-checkout' type='button' className='large'>
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

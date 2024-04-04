import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';

import { removeItemFromShoppingCart } from '../../reducers/orderReducer';

import { contentToText } from '../../types/languageFunctions';

import BackButton from '../BackButton';
import { Link } from '../CustomLink';
import ShoppingCartContent from './ShoppingCartContent';

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const orderState = useSelector((state: RootState) => state.order);

    const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth); // TEMP
    const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight); // TEMP

    useEffect(() => {
        // TEMP
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
            setViewportHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // empty dependency array means this effect runs once after the component mounts

    // Page title:
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
                {contentToText(ContentID.menuShoppingCart, config)} | {viewportWidth}x{viewportHeight}
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

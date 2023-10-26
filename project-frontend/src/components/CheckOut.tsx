import { useEffect, useState } from 'react';

import { ItemPair } from './ShoppinCart';
import { NewOrder, OrderStatus } from '../types/orderTypes';

import { fetchItems } from '../util/checkoutProvider';
import { pageWidth } from '../constants';

import BackButton from './BackButton';
import CheckOutContactInfo from './CheckOutContactInfo';
import CheckOutDelivery from './CheckOutDelivery';
import { Link } from './CustomLink';
import OrderInfo from './OrderInfo';
{
    /*import ShoppingCartContent from './ShoppingCartContent';*/
}

const CheckOut = () => {
    const [items, setItems] = useState<ItemPair[]>([]);
    const [order, setOrder] = useState<NewOrder>({ customer: null, recipient: null, items: [], deliveryMethod: null, paymentMethod: null, status: OrderStatus.PENDING });

    const fetch = async () => {
        setItems(await fetchItems());
    };

    useEffect(() => {
        fetch();
    }, []);

    return (
        <div>
            <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                <tbody>
                    <tr>
                        <td>
                            <h3 className='underlined'>Check out</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            {/*<ShoppingCartContent allowEdit={false} fetchItems={fetch} items={items} removeItem={null} width={pageWidth} />*/}
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td width='50%'>
                            <CheckOutDelivery width='100%' />
                            <CheckOutContactInfo width='100%' />
                        </td>
                        <td style={{ verticalAlign: 'top' }}>
                            <OrderInfo order={order} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='text' />
                        </td>
                        <td className='sizeVeryLarge' style={{ textAlign: 'right' }}>
                            <Link to='/checkout'>Payment →</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CheckOut;

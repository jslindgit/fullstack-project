import { Config, Item } from '../types/types';

import format from '../util/format';

import { Link } from './CustomLink';

interface ItemColumnProps {
    item: Item;
    config: Config;
}
const ItemColumn = ({ item, config }: ItemColumnProps) => {
    return (
        <>
            <Link to={'/shop/item/' + item.id}>
                <table align='center' width='100%' className='item'>
                    <tbody>
                        <tr>
                            <td className='sizeVeryLarge'>{item.name}</td>
                        </tr>
                        <tr>
                            <td className='sizeNormal'>{format.currency(item.price, config)}</td>
                        </tr>
                        <tr>
                            <td className={'sizeSmallish ' + (item.instock > 0 ? 'itemInStock' : 'itemSoldOut')}>{item.instock > 0 ? 'In stock' : 'Sold out'}</td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        </>
    );
};

export default ItemColumn;

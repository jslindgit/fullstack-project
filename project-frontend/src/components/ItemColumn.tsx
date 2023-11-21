import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { Item } from '../types/types';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import format from '../util/format';
import { imageFullPath } from '../util/misc';

import { Link } from './CustomLink';

interface ItemColumnProps {
    item: Item;
    config: Config;
}
const ItemColumn = ({ item, config }: ItemColumnProps) => {
    const imagePath = item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <>
            <Link to={'/shop/item/' + item.id}>
                <table align='center' width='100%' className='item'>
                    <tbody>
                        <tr>
                            <td>
                                <table width='100%'>
                                    <tbody>
                                        <tr>
                                            <td className='sizeVeryLarge'>{langTextsToText(item.name, config)}</td>
                                        </tr>
                                        <tr className='itemPriceTd'>
                                            <td className='sizeNormal itemPriceTd'>{format.currency(item.price, config)}</td>
                                        </tr>
                                        <tr>
                                            <td className={'sizeSmallish ' + (item.instock > 0 ? 'itemInStock' : 'itemSoldOut')}>
                                                {contentToText(item.instock > 0 ? ContentID.itemsInStock : ContentID.itemsSoldOut, config)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td width='1px'>
                                <img src={imageFullPath(imagePath)} className='imgItemColumn' />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        </>
    );
};

export default ItemColumn;

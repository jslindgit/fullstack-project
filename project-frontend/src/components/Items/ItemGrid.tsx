import { ContentID } from '../../content';
import { Config } from '../../types/configTypes';
import { Item } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import format from '../../util/format';
import { itemInStockTotal } from '../../util/misc';

import { Link } from '../CustomLink';

interface ItemColumnProps {
    item: Item;
    config: Config;
}
const ItemGridColumn = ({ item, config }: ItemColumnProps) => {
    const imagePath = item.images.length > 0 ? item.images[0] : '/no_image.png';

    return (
        <div>
            <Link to={'/shop/item/' + item.id}>
                <div className='item'>
                    <div className='grid-container left heightFull' data-cols='1fr auto' data-gap='1rem'>
                        <div className='grid-container heightFull' data-cols='1' data-gap='1rem'>
                            <div className='semiBold sizeLarge'>{langTextsToText(item.name, config)}</div>
                            <div className='semiBold sizeNormal'>{format.currency(item.price, config)}</div>
                            <div className={'semiBold sizeSmallish ' + (itemInStockTotal(item) > 0 ? 'itemInStock' : 'itemSoldOut')}>
                                {contentToText(itemInStockTotal(item) > 0 ? ContentID.itemsInStock : ContentID.itemsSoldOut, config)}
                            </div>
                        </div>
                        <div className='valignMiddle'>
                            <img src={imagePath} className='imgItemColumn' />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

interface Props {
    colsPerRow: 1 | 2 | 3 | 4 | 5;
    config: Config;
    items: Item[];
}
const ItemGrid = ({ colsPerRow, config, items }: Props) => (
    <div className='grid-container' data-cols={colsPerRow.toString()} data-gap='2rem'>
        {items.map((item) => (
            <ItemGridColumn key={item.id} item={item} config={config} />
        ))}
    </div>
);

export default ItemGrid;

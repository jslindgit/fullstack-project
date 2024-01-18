import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { Item } from '../types/types';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import format from '../util/format';
import { imageFullPath, itemInStockTotal } from '../util/misc';

import { Link } from './CustomLink';

interface ItemColumnProps {
    item: Item;
    config: Config;
}
const ItemGridColumn = ({ item, config }: ItemColumnProps) => {
    const imagePath = item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <div>
            <Link to={'/shop/item/' + item.id}>
                <div className='item'>
                    <div className='grid-container' data-gap='1rem' style={{ gridTemplateColumns: '1fr auto', height: '100%' }}>
                        <div className='grid-container' data-cols='1' data-gap='1rem' style={{ height: '100%', textAlign: 'left' }}>
                            <div className='sizeLarge'>{langTextsToText(item.name, config)}</div>
                            <div className='sizeNormal'>{format.currency(item.price, config)}</div>
                            <div className={'sizeSmallish ' + (itemInStockTotal(item) > 0 ? 'itemInStock' : 'itemSoldOut')}>
                                {contentToText(itemInStockTotal(item) > 0 ? ContentID.itemsInStock : ContentID.itemsSoldOut, config)}
                            </div>
                        </div>
                        <div className='valignMiddle'>
                            <img src={imageFullPath(imagePath)} className='imgItemColumn' />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

interface Props {
    colsPerRow: number;
    config: Config;
    items: Item[];
}
const ItemGrid = ({ colsPerRow, config, items }: Props) => (
    <div className='grid-container' data-gap='2rem' style={{ gridTemplateColumns: `repeat(${colsPerRow}, 1fr)` }}>
        {items.map((item) => (
            <ItemGridColumn key={item.id} item={item} config={config} />
        ))}
    </div>
);

export default ItemGrid;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { testItemId, VITE_ENV } from '../../constants';
import format from '../../util/format';
/*import itemService from '../../services/itemService';*/
import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { useItemGetByIdQuery } from '../../services/apiSlice';

import AddToCart from './AddToCart';
import BackButton from '../BackButton';
import Image from '../Image';
import ItemsMenu from './ItemsMenu';
import { ContentID } from '../../content';

const ItemDetails = () => {
    const id = Number(useParams().id);

    const itemGetById = useItemGetByIdQuery(id);

    const config = useSelector((state: RootState) => state.config);

    const [item, setItem] = useState<Item | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');

    // Title:
    useEffect(() => {
        document.title = contentToText(ContentID.menuProducts, config) + ' | ' + config.store.contactName;
    }, [config]);

    // Fetch Item:
    useEffect(() => {
        if (itemGetById.data && (id !== testItemId || VITE_ENV === 'test')) {
            setItem(itemGetById.data);
        } else {
            console.log('id:', id);
            console.log('VITE_ENV:', VITE_ENV);
            setLoading(contentToText(ContentID.errorSomethingWentWrong, config));
        }
    }, [config, id, itemGetById.data]);

    if (!item) {
        return (
            <div className='sizeLarge'>
                <br />
                {loading}
            </div>
        );
    }

    return (
        <div className='pageWidth'>
            <ItemsMenu config={config} currentId={id} />
            <div className='pageWidth_66'>
                <div className='itemDetails marginBottom3 marginTop3'>
                    <div data-testid='item-name' className='alignLeft itemDetailsName marginBottom2'>
                        {langTextsToText(item.name, config)}
                    </div>
                    <div className='grid-container' data-cols='item-details' data-gap='1rem'>
                        <div className='alignLeft grid-container' data-cols='1' data-gap='2rem'>
                            <div className='divMinWidth itemDetailsPrice noWrap'>{format.currency(item.price, config)}</div>
                            <div className='itemDetailsDescription'>{langTextsToText(item.description, config)}</div>
                            <div>
                                <AddToCart config={config} item={item} />
                            </div>
                        </div>
                        <div className='valignTop'>
                            {item.images.length > 0 ? (
                                <>
                                    {item.images.map((url) => (
                                        <div key={url}>
                                            <Image src={url} className='imgItemDetails' />
                                            {item.images.indexOf(url) < item.images.length - 1 ? <br /> : ''}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <img src={'/no_image.png'} className='imgItemDetails' />
                            )}
                        </div>
                    </div>
                </div>
                <div className='alignLeft marginBottom1_25'>
                    <BackButton type='text' />
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;

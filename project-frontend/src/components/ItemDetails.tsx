import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import format from '../util/format';
import { handleError } from '../util/handleError';
import itemService from '../services/itemService';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { imageFullPath } from '../util/misc';

import AddToCart from './AddToCart';
import BackButton from './BackButton';
import Image from './Image';
import ItemsMenu from './ItemsMenu';
import { ContentID } from '../content';

const ItemDetails = () => {
    const config = useSelector((state: RootState) => state.config);

    const [item, setItem] = useState<Item | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');

    const id = Number(useParams().id);

    useEffect(() => {
        document.title = contentToText(ContentID.menuProducts, config) + ' | ' + config.store.contactName;

        try {
            itemService.getById(id).then((res) => {
                setItem(res as Item);
            });
        } catch (err: unknown) {
            handleError(err);
            setLoading('Something went wrong :(');
        }
    }, [config, id]);

    if (!item) {
        return (
            <>
                <br />
                <h4>{loading}</h4>
            </>
        );
    }

    return (
        <>
            <ItemsMenu config={config} currentId={id} />
            <div style={{ margin: '2em auto', maxWidth: pageWidth, width: (pageWidth / 3) * 2 }}>
                <div className='itemDetails'>
                    <div data-testid='item-name' className='alignLeft itemDetailsName' style={{ marginBottom: '2rem' }}>
                        {langTextsToText(item.name, config)}
                    </div>
                    <div className='grid-container' data-gap='1rem' style={{ gridTemplateColumns: '1fr 40%' }}>
                        <div className='alignLeft grid-container' data-cols='1' data-gap='2rem'>
                            <div className='itemDetailsPrice'>{format.currency(item.price, config)}</div>
                            <div>{langTextsToText(item.description, config)}</div>
                            <div>
                                <AddToCart config={config} item={item} />
                            </div>
                        </div>
                        <div className='valignTop'>
                            {item.images.length > 0 ? (
                                <>
                                    {item.images.map((path) => (
                                        <div key={path}>
                                            <Image src={imageFullPath(path)} className='imgItemDetails' />
                                            {item.images.indexOf(path) < item.images.length - 1 ? <br /> : ''}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <img src={imageFullPath('misc/_no_image.png')} className='imgItemDetails' />
                            )}
                        </div>
                    </div>
                </div>
                <div className='alignLeft' style={{ marginTop: '2.5em' }}>
                    <BackButton type='text' />
                </div>
            </div>
        </>
    );
};

export default ItemDetails;

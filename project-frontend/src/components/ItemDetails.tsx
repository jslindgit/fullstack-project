import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import format from '../util/format';
import { handleError } from '../util/handleError';
import itemService from '../services/itemService';
import { pageWidth } from '../constants';

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
        try {
            itemService.getById(id).then((res) => {
                setItem(res as Item);
            });
        } catch (err: unknown) {
            handleError(err);
            setLoading('Something went wrong :(');
        }
    }, [id]);

    if (!item) {
        return (
            <>
                <br />
                <h4>{loading}</h4>
            </>
        );
    }

    const imagePath = item.images.length > 0 ? item.images[0] : 'misc/_no_image.png';

    return (
        <div>
            <table align='center'>
                <tbody>
                    <tr>
                        <td style={{ padding: 0 }}>
                            <ItemsMenu config={config} currentId={id} />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={(pageWidth / 3) * 2} className='itemDetails'>
                <tbody>
                    <tr>
                        <td width='50%' style={{ paddingLeft: 0 }}>
                            <table align='center' width='100%'>
                                <tbody>
                                    <tr>
                                        <td className='itemDetailsName'>{langTextsToText(item.name, config)}</td>
                                    </tr>
                                    <tr>
                                        <td>{langTextsToText(item.description, config)}</td>
                                    </tr>
                                    <tr>
                                        <td className='itemDetailsPrice'>{format.currency(item.price, config)}</td>
                                    </tr>
                                    <tr>
                                        <td className={'semiBold ' + (item.instock > 0 ? 'itemInStock' : 'itemSoldOut')}>
                                            {item.instock > 0
                                                ? `${contentToText(ContentID.itemsInStock, config)} (${item.instock})`
                                                : contentToText(ContentID.itemsSoldOut, config)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <AddToCart config={config} item={item} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='50%' className='valignTop' style={{ paddingRight: 0 }}>
                            <table align='center'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Image path={imagePath} className='imgItemDetails' />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={(pageWidth / 3) * 2}>
                <tbody>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <BackButton type='text' />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ItemDetails;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import format from '../util/format';
import { handleError } from '../util/handleError';
import { imageFullPath } from '../util/misc';
import itemService from '../services/itemService';
import { pageWidth } from '../constants';

import AddToCart from './AddToCart';
import BackButton from './BackButton';
import ItemsMenu from './ItemsMenu';
import { ContentID } from '../content';

const ItemDetails = () => {
    const configState = useSelector((state: RootState) => state.config);

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
                            <ItemsMenu />
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
                        <td width='50%'>
                            <table align='center' width='100%'>
                                <tbody>
                                    <tr>
                                        <td className='itemDetailsName'>{item.name}</td>
                                    </tr>
                                    <tr>
                                        <td>{item.description}</td>
                                    </tr>
                                    <tr>
                                        <td className='itemDetailsPrice'>{format.currency(item.price, configState)}</td>
                                    </tr>
                                    <tr>
                                        <td className={'semiBold ' + (item.instock > 0 ? 'itemInStock' : 'itemSoldOut')}>
                                            {item.instock > 0 ? `${contentToText(ContentID.itemsInStock, configState)} (${item.instock})` : contentToText(ContentID.itemsSoldOut, configState)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <AddToCart config={configState} item={item} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='50%' className='valignTop'>
                            <table align='center'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img src={imageFullPath(imagePath)} className='imgItemDetails' />
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

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
                        <td colSpan={2} className='itemDetailsName' style={{ paddingBottom: 0 }}>
                            {langTextsToText(item.name, config)}
                        </td>
                    </tr>
                    <tr>
                        <td width='50%' className='valignTop' style={{ paddingLeft: 0 }}>
                            <table align='center' width='100%'>
                                <tbody>
                                    <tr>
                                        <td className='itemDetailsPrice'>{format.currency(item.price, config)}</td>
                                    </tr>
                                    <tr>
                                        <td>{langTextsToText(item.description, config)}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <AddToCart config={config} item={item} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='50%' className='valignTop' style={{ paddingRight: 0, paddingTop: '0.7rem' }}>
                            <table align='center'>
                                <tbody>
                                    <tr>
                                        <td>
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

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { handleError } from '../util/error_handler';
import itemService from '../services/itemService';
import { pageWidth } from '../constants';

import ItemsMenu from './ItemsMenu';

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
            <table align='center' className='itemDetails' width={pageWidth / 2}>
                <tbody>
                    <tr>
                        <td>
                            <h4>{item.name}</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>{item.description}</td>
                    </tr>
                    <tr>
                        <td>{format.currency(item.price, configState)}</td>
                    </tr>
                    <tr>
                        <td className={item.instock > 0 ? 'itemInStock' : 'itemSoldOut'}>{item.instock > 0 ? `In stock (${item.instock})` : 'Sold out'}</td>
                    </tr>
                    <tr>
                        <td>
                            <button type='button' disabled={item.instock <= 0}>
                                Add to shopping cart
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ItemDetails;

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Config, Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { isNumber } from '../types/type_functions';
import { pageWidth } from '../constants';

import { Link } from './CustomLink';
import ItemsMenu from './ItemsMenu';

interface ItemColProps {
    item: Item;
    config: Config;
}
const ItemCol = ({ item, config }: ItemColProps) => {
    return (
        <td width='33.33%'>
            <Link to={'/shop/item/' + item.id}>
                <table align='center' width='100%' className='categoryLink'>
                    <tbody>
                        <tr>
                            <td>
                                <span className='sizeLarge' style={{ lineHeight: 1.5 }}>
                                    {item.name}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br />
                                {format.currency(item.price, config)}
                                <br />
                                {item.instock > 0 ? 'In stock' : 'Sold out'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        </td>
    );
};

const addRemainingCols = (colstoAdd: number) => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < colstoAdd; i++) {
        result.push(<td key={'col' + i} width='33.33%'></td>);
    }
    return result;
};

interface ItemRowProps {
    items: Item[];
    colsPerRow: number;
    config: Config;
}
const ItemRow = ({ items, colsPerRow, config }: ItemRowProps) => {
    const extraCols = addRemainingCols(colsPerRow - items.length);
    return (
        <tr>
            {items.map((item) => (
                <ItemCol key={item.id} item={item} config={config} />
            ))}
            {extraCols}
        </tr>
    );
};

const Items = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);

    const navigate = useNavigate();

    const id = Number(useParams().id);
    const category = id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;

    useEffect(() => {
        if (miscState.loaded && category === undefined) {
            navigate('/shop');
        }
    }, [category, miscState.loaded, navigate]);

    if (!category) {
        return <></>;
    }

    const cols = 3;
    const rows: Array<Item[]> = [];
    for (let i = 0; i < categoryState.length; i += cols) {
        rows.push(category.items.slice(i, i + cols));
    }

    return (
        <>
            <div>
                <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                    <tbody>
                        <tr>
                            <td style={{ padding: 0 }}>
                                <ItemsMenu categories={categoryState} />
                            </td>
                        </tr>
                        <tr>
                            <td className='pageHeader' style={{ paddingTop: 'calc(var(--default-padding) * 0.5)', paddingBottom: 'var(--default-padding)' }}>
                                {category.name}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table align='center' width={pageWidth} className='noOuterPadding'>
                    <tbody>
                        {rows.map((row, index) => (
                            <ItemRow key={index} items={row} colsPerRow={cols} config={configState} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Items;

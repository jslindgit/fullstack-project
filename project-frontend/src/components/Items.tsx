import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Config, Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { isNumber } from '../types/typeFunctions';
import { pageWidth } from '../constants';

import ItemColumn from './ItemColumn';
import ItemsMenu from './ItemsMenu';

const itemsPerRow = 3;
const columnWidth = (100.0 / itemsPerRow).toString() + '%';

const addRemainingCols = (colstoAdd: number) => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < colstoAdd; i++) {
        result.push(<td key={'col' + i} width={columnWidth}></td>);
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
                <td key={item.id} width={columnWidth}>
                    <ItemColumn item={item} config={config} />
                </td>
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
                                <ItemsMenu />
                            </td>
                        </tr>
                        <tr>
                            <td className='tight pageHeader underlined'>
                                <h3>{category.name}</h3>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {category.items.length <= 0 ? (
                    <div>No items in this category</div>
                ) : (
                    <table align='center' width={pageWidth} className='noOuterPadding'>
                        <tbody>
                            {rows.map((row, index) => (
                                <ItemRow key={index} items={row} colsPerRow={cols} config={configState} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default Items;

import { Config } from '../types/configTypes';
import { Item } from '../types/types';

import ItemColumn from './ItemColumn';

interface ItemRowProps {
    items: Item[];
    colsPerRow: number;
    config: Config;
}

const ItemsRow = ({ items, colsPerRow, config }: ItemRowProps) => {
    const columnWidth = (100.0 / colsPerRow).toString() + '%';

    const addRemainingCols = (colstoAdd: number) => {
        const result: JSX.Element[] = [];
        for (let i = 0; i < colstoAdd; i++) {
            result.push(<td key={'col' + i} width={columnWidth}></td>);
        }
        return result;
    };

    const extraCols = addRemainingCols(colsPerRow - items.length);

    return (
        <tr style={{ height: '100%' }}>
            {items.map((item) => (
                <td key={item.id} width={columnWidth}>
                    <ItemColumn item={item} config={config} />
                </td>
            ))}
            {extraCols}
        </tr>
    );
};

export default ItemsRow;

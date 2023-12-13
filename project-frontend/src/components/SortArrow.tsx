import { Config } from '../types/configTypes';
import { ContentID } from '../content';

import { contentToText } from '../types/languageFunctions';

interface Props {
    column: string;
    config: Config;
    setSortDirection: (value: React.SetStateAction<'asc' | 'desc'>) => void;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

const SortArrow = ({ column, sortBy, sortDirection, setSortDirection, config }: Props) => (
    <span
        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        className={'clickable ' + (column === sortBy ? 'colorGoldVeryLight' : 'colorTransparent')}
        title={contentToText(ContentID.miscClickToChangeSortingOrder, config)}
    >
        &nbsp;{sortDirection === 'asc' ? '▲' : '▼'}
    </span>
);

export default SortArrow;

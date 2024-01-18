import { Config } from '../types/configTypes';
import { Category } from '../types/types';

import { langTextsToText } from '../types/languageFunctions';

import { Link } from './CustomLink';

interface CategoryItemProps {
    category: Category;
    colsPerRow: number;
    config: Config;
}
const CategoryItem = ({ category, colsPerRow, config }: CategoryItemProps) => {
    return (
        <td width={(100 / colsPerRow).toString() + '%'}>
            <Link to={'/shop/' + category.id}>
                <table align='center' width='100%' className='categoryLink'>
                    <tbody>
                        <tr>
                            <td>
                                <div className='sizeLarge' style={{ lineHeight: 1.5, marginBottom: '-0.5em' }}>
                                    {langTextsToText(category.name, config)}
                                </div>
                                <br />
                                <span className='sizeSmallish'>{langTextsToText(category.description, config)}</span>
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

interface CategoryRowProps {
    categories: Category[];
    colsPerRow: number;
    config: Config;
}
const CategoryRow = ({ categories, colsPerRow, config }: CategoryRowProps) => {
    const extraCols = addRemainingCols(colsPerRow - categories.length);
    return (
        <tr>
            {categories.map((c) => (
                <CategoryItem key={c.id} category={c} colsPerRow={colsPerRow} config={config} />
            ))}
            {extraCols}
        </tr>
    );
};

export default CategoryRow;

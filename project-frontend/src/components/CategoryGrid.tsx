import { useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { RootState } from '../reducers/rootReducer';
import { Category } from '../types/types';

import { langTextsToText } from '../types/languageFunctions';

import { Link } from './CustomLink';

interface ColumnProps {
    category: Category;
    config: Config;
}
const CategoryGridColumn = ({ category, config }: ColumnProps) => (
    <div>
        <Link to={'/shop/' + category.id}>
            <div className='categoryLink grid-container' data-cols='1' data-gap='1.5rem'>
                <div className='sizeLarge' style={{ lineHeight: 1.5, marginBottom: '-0.5em' }}>
                    {langTextsToText(category.name, config)}
                </div>
                <div className='sizeSmallish'>{langTextsToText(category.description, config)}</div>
            </div>
        </Link>
    </div>
);

interface Props {
    colsPerRow: number;
}
const CategoryGrid = ({ colsPerRow }: Props) => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);

    return (
        <div className='grid-container' data-gap='2rem' style={{ gridTemplateColumns: `repeat(${colsPerRow}, 1fr)` }}>
            {categoryState.categories.map((category) => (
                <CategoryGridColumn key={category.id} category={category} config={config} />
            ))}
        </div>
    );
};

export default CategoryGrid;

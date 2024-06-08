import { useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { RootState } from '../redux/rootReducer';
import { Category } from '../types/types';

import { langTextsToText } from '../types/languageFunctions';

import { useCategoryGetAllQuery } from '../redux/categorySlice';

import { Link } from './CustomLink';
import LoadingQuery from './LoadingQuery';

interface ColumnProps {
    category: Category;
    config: Config;
}
const CategoryGridColumn = ({ category, config }: ColumnProps) => (
    <div>
        <Link to={'/shop/' + category.id}>
            <div className='categoryLink grid-container' data-cols='1' data-gap='1rem'>
                <div className='semiBold sizeLarge'>{langTextsToText(category.name, config)}</div>
                <div className='semiBold sizeSmallish'>{langTextsToText(category.description, config)}</div>
            </div>
        </Link>
    </div>
);

const CategoryGrid = () => {
    const categoryGetAll = useCategoryGetAllQuery();

    const config = useSelector((state: RootState) => state.config);

    if (!categoryGetAll.data) {
        return <LoadingQuery query={categoryGetAll} config={config} />;
    }

    return (
        <div className='grid-container' data-gap='2rem' data-cols='category-grid'>
            {[...categoryGetAll.data]
                .sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config)))
                .map((category) => (
                    <CategoryGridColumn key={category.id} category={category} config={config} />
                ))}
            <div />
        </div>
    );
};

export default CategoryGrid;

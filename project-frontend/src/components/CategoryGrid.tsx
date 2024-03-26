import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { RootState } from '../reducers/rootReducer';
import { Category } from '../types/types';

import categoryService from '../services/categoryService';
import { langTextsToText } from '../types/languageFunctions';

import { Link } from './CustomLink';
import Loading from './Loading';

interface ColumnProps {
    category: Category;
    config: Config;
}
const CategoryGridColumn = ({ category, config }: ColumnProps) => (
    <div>
        <Link to={'/shop/' + category.id}>
            <div className='categoryLink grid-container' data-cols='1' data-gap='1rem'>
                <div className='sizeLarge'>{langTextsToText(category.name, config)}</div>
                <div className='sizeSmallish'>{langTextsToText(category.description, config)}</div>
            </div>
        </Link>
    </div>
);

interface Props {
    colsPerRow: 2 | 3;
}
const CategoryGrid = ({ colsPerRow }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    // Fetch the categories from server:
    useEffect(() => {
        const fetch = async () => {
            const fetchedCategories = await categoryService.getAll();
            setCategories(fetchedCategories.sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))));
            setLoaded(true);
        };

        fetch();
    }, [config]);

    return (
        <>
            {loaded ? (
                <div className='grid-container' data-gap='2rem' data-cols={colsPerRow.toString()}>
                    {categories.map((category) => (
                        <CategoryGridColumn key={category.id} category={category} config={config} />
                    ))}
                </div>
            ) : (
                <Loading config={config} />
            )}
        </>
    );
};

export default CategoryGrid;

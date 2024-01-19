import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Category } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import { pageWidth } from '../constants';

import { ContentID } from '../content';

import CategoryGrid from './CategoryGrid';

const Categories = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = contentToText(ContentID.menuProducts, config) + ' | ' + config.store.contactName;
    }, [config]);

    if (categoryState.categories.length < 1) {
        return (
            <div>
                <br />
                Looks like there are no products available yet.
            </div>
        );
    }

    const cols = 2;
    const rows: Array<Category[]> = [];
    for (let i = 0; i < categoryState.categories.length; i += cols) {
        rows.push(categoryState.categories.slice(i, i + cols));
    }

    return (
        <div style={{ margin: 'auto', maxWidth: pageWidth }}>
            <div className='pageHeader'>{contentToText(ContentID.itemsAllCategories, config)}</div>
            <CategoryGrid colsPerRow={2} />
        </div>
    );
};

export default Categories;

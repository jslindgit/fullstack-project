import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import { pageWidth } from '../constants';

import { ContentID } from '../content';

import CategoryGrid from './CategoryGrid';

const Categories = () => {
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = contentToText(ContentID.menuProducts, config) + ' | ' + config.store.contactName;
    }, [config]);

    return (
        <div style={{ margin: 'auto', maxWidth: pageWidth }}>
            <div data-testid='categories-header' className='pageHeader'>
                {contentToText(ContentID.itemsAllCategories, config)}
            </div>
            <CategoryGrid colsPerRow={2} />
        </div>
    );
};

export default Categories;

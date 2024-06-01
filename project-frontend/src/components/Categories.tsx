import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/rootReducer';

import { contentToText } from '../types/languageFunctions';

import { ContentID } from '../content';

import CategoryGrid from './CategoryGrid';

const Categories = () => {
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = contentToText(ContentID.menuProducts, config) + ' | ' + config.store.contactName;
    }, [config]);

    return (
        <div className='pageWidth'>
            <div data-testid='categories-header' className='pageHeader'>
                {contentToText(ContentID.itemsAllCategories, config)}
            </div>
            <CategoryGrid />
        </div>
    );
};

export default Categories;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { Category } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { isNumber } from '../types/typeFunctions';

import ItemGrid from './ItemGrid';
import ItemsMenu from './ItemsMenu';

const Items = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);

    const [category, setCategory] = useState<Category | undefined>(undefined);

    const navigate = useNavigate();

    const idParam = useParams().id;

    // Get Category from URL:
    useEffect(() => {
        if (idParam) {
            const id = Number(idParam);
            const cat = isNumber(id) && !isNaN(id) ? categoryState.categories.find((c) => c.id === id) : undefined;

            if (!cat && miscState.loaded) {
                navigate('/shop');
            } else {
                setCategory(cat);
            }
        }
    }, [categoryState, idParam, miscState.loaded, navigate]);

    if (!category) {
        return <></>;
    }

    return (
        <>
            <ItemsMenu config={config} currentId={category.id} />
            <div style={{ margin: 'auto', maxWidth: pageWidth }}>
                <div className='pageHeader'>{langTextsToText(category.name, config)}</div>
                {category.items.length < 1 ? (
                    <div>{contentToText(ContentID.itemsNoItemsInCategory, config)}</div>
                ) : (
                    <ItemGrid items={category.items} colsPerRow={3} config={config} />
                )}
            </div>
        </>
    );
};

export default Items;

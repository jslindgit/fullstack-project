import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Category } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import categoryService from '../../services/categoryService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { isNumber } from '../../types/typeFunctions';

import ItemGrid from './ItemGrid';
import ItemsMenu from './ItemsMenu';

const Items = () => {
    const config = useSelector((state: RootState) => state.config);

    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | undefined>(undefined);
    const [loaded, setLoaded] = useState<boolean>(false);

    const navigate = useNavigate();

    const idParam = useParams().id;

    // Fetch the categories from server:
    useEffect(() => {
        const fetch = async () => {
            const fetchedCategories = await categoryService.getAll();
            setCategories(fetchedCategories.sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))));
            setLoaded(true);
        };

        fetch();
    }, [config]);

    // Get Category from URL:
    useEffect(() => {
        if (idParam) {
            const id = Number(idParam);
            const cat = isNumber(id) && !isNaN(id) ? categories.find((c) => c.id === id) : undefined;

            if (!cat && loaded) {
                navigate('/shop');
            } else {
                setCategory(cat);
            }
        }
    }, [categories, idParam, loaded, navigate]);

    if (!category) {
        return <></>;
    }

    return (
        <>
            <ItemsMenu config={config} currentId={category.id} />
            <div className='pageWidth'>
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

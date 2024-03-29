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
import Loading from '../Loading';

const Items = () => {
    const config = useSelector((state: RootState) => state.config);

    const [category, setCategory] = useState<Category | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const navigate = useNavigate();

    const idParam = useParams().id;

    // Get Category from URL:
    useEffect(() => {
        const fetch = async () => {
            const id = idParam ? Number(idParam) : undefined;

            if (id && isNumber(id) && !isNaN(id)) {
                setCategory(await categoryService.getById(id));
            }

            setLoaded(true);
        };

        fetch();
    }, [idParam]);

    // If there's an invalid Category id in the url, navigate back to /shop:
    useEffect(() => {
        if (loaded && !category) {
            navigate('/shop');
        }
    }, [category, loaded, navigate]);

    if (!category) {
        return <Loading config={config} text={loaded ? contentToText(ContentID.errorSomethingWentWrong, config) : null} />;
    }

    return (
        <>
            <ItemsMenu config={config} currentId={category.id} />
            <div className='pageWidth'>
                <div className='pageHeader'>{langTextsToText(category.name, config)}</div>
                {category.items.length < 1 ? (
                    <div>{contentToText(ContentID.itemsNoItemsInCategory, config)}</div>
                ) : (
                    <ItemGrid
                        items={[...category.items].sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config)))}
                        colsPerRow={3}
                        config={config}
                    />
                )}
            </div>
        </>
    );
};

export default Items;

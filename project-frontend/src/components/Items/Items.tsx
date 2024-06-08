import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';

import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { useCategoryGetByIdQuery } from '../../redux/categorySlice';

import ItemGrid from './ItemGrid';
import ItemsMenu from './ItemsMenu';
import LoadingQuery from '../LoadingQuery';
import { isNumber } from '../../types/typeFunctions';

const Items = () => {
    const config = useSelector((state: RootState) => state.config);

    const navigate = useNavigate();

    const idParam = Number(useParams().id);

    const categoryGetById = useCategoryGetByIdQuery(idParam, { skip: !isNumber(idParam) });

    useEffect(() => {
        if (categoryGetById.isError || !isNumber(idParam)) {
            navigate('/shop');
        }
    }, [categoryGetById, idParam, navigate]);

    if (!categoryGetById.data) {
        return <LoadingQuery query={categoryGetById} config={config} />;
    }

    return (
        <>
            <ItemsMenu config={config} currentId={categoryGetById.data.id} />
            <div className='pageWidth'>
                <div className='pageHeader'>{langTextsToText(categoryGetById.data.name, config)}</div>
                {categoryGetById.data.items.length < 1 ? (
                    <div>{contentToText(ContentID.itemsNoItemsInCategory, config)}</div>
                ) : (
                    <ItemGrid
                        items={[...categoryGetById.data.items].sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config)))}
                        config={config}
                    />
                )}
            </div>
            <br />
        </>
    );
};

export default Items;

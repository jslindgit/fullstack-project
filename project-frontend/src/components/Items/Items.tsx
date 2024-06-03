import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';

import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { useCategoryGetByIdQuery } from '../../redux/categorySlice';

import ItemGrid from './ItemGrid';
import ItemsMenu from './ItemsMenu';
import Loading from '../Loading';

const Items = () => {
    const config = useSelector((state: RootState) => state.config);

    const navigate = useNavigate();
    const idParam = Number(useParams().id);

    const categoryGetById = useCategoryGetByIdQuery(idParam);

    if (!categoryGetById.data) {
        if (categoryGetById.isLoading) {
            return <Loading config={config} />;
        } else {
            navigate('/shop');
            return <></>;
        }
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

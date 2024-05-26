import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { Item } from '../types/types';

import { apiSlice } from '../services/apiSlice';
import { contentToText, langTextsToText } from '../types/languageFunctions';

import CategoryGrid from './CategoryGrid';
import Description from './Description';
import ItemGrid from './Items/ItemGrid';
import Loading from './Loading';

const MainPage = () => {
    const itemsQuery = apiSlice.useItemGetAllQuery();

    const config = useSelector((state: RootState) => state.config);

    const [latestItems, setLatestItems] = useState<Item[]>([]);
    const [topSellers, setTopSellers] = useState<Item[]>([]);

    // Title:
    useEffect(() => {
        document.title = config.store.contactName;
    }, [config]);

    useEffect(() => {
        if (itemsQuery.data) {
            setLatestItems(
                [...itemsQuery.data]
                    .filter((item) => item.categories.length > 0)
                    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                    .reverse()
                    .slice(0, 3)
            );

            setTopSellers([...itemsQuery.data].sort((a, b) => b.sold - a.sold).slice(0, 3));
        }
    }, [itemsQuery]);

    if (itemsQuery.isLoading || itemsQuery.error) {
        return <Loading config={config} text={itemsQuery.error ? contentToText(ContentID.errorSomethingWentWrong, config) : null} />;
    }

    return (
        <>
            <div className='grid-container marginBottom1 marginTop2 pageWidth' data-cols='1' data-gap='2rem'>
                <div data-testid='welcome-message' className='pageWidth semiBold sizeExtremelyLarge'>
                    {langTextsToText(config.store.welcome, config)}
                </div>
                <div className='sizeLarge'>
                    <Description config={config} />
                </div>
                <div>
                    <div className='pageHeader'>{contentToText(ContentID.itemsLatestItems, config)}</div>
                    <ItemGrid config={config} items={latestItems} />
                </div>
                <div>
                    <div className='pageHeader'>{contentToText(ContentID.itemsTopSellers, config)}</div>
                    <ItemGrid config={config} items={topSellers} />
                </div>
                <div>
                    <div className='pageHeader'>{contentToText(ContentID.itemsAllCategories, config)}</div>
                    <CategoryGrid />
                </div>
            </div>
        </>
    );
};

export default MainPage;

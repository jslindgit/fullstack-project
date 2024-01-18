import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { Item } from '../types/types';

import { pageWidth } from '../constants';
import itemService from '../services/itemService';
import { contentToText, langTextsToText } from '../types/languageFunctions';

import CategoryGrid from './CategoryGrid';
import Description from './Description';
import ItemGrid from './ItemGrid';

const MainPage = () => {
    const config = useSelector((state: RootState) => state.config);

    const [latestItems, setLatestItems] = useState<Item[]>([]);
    const [topSellers, setTopSellers] = useState<Item[]>([]);

    // Title:
    useEffect(() => {
        document.title = config.store.contactName;
    }, [config]);

    // Latest Items:
    useEffect(() => {
        const setLatestAndTopSellers = async () => {
            const allItems = await itemService.getAll();

            setLatestItems(
                [...allItems]
                    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                    .reverse()
                    .slice(0, 3)
            );

            setTopSellers([...allItems].sort((a, b) => b.sold - a.sold).slice(0, 3));
        };

        setLatestAndTopSellers();
    }, []);

    return (
        <>
            <div
                className='grid-container'
                data-cols='1'
                data-gap='2rem'
                style={{ margin: 'auto', marginBottom: '5rem', marginTop: '2rem', maxWidth: pageWidth }}
            >
                <div className='semiBold sizeExtremelyLarge'>{langTextsToText(config.store.welcome, config)}</div>
                <div className='sizeLarge' style={{ marginBottom: '1rem' }}>
                    <Description config={config} />
                </div>
                <div>
                    <div className='pageHeader'>{contentToText(ContentID.itemsLatestItems, config)}</div>
                    <ItemGrid colsPerRow={3} config={config} items={latestItems} />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <div className='pageHeader'>{contentToText(ContentID.itemsTopSellers, config)}</div>
                    <ItemGrid colsPerRow={3} config={config} items={topSellers} />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <div className='pageHeader'>{contentToText(ContentID.itemsAllCategories, config)}</div>
                    <CategoryGrid colsPerRow={2} />
                </div>
            </div>
        </>
    );
};

export default MainPage;

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';
import { Item } from '../types/types';

import { pageWidth } from '../constants';
import itemService from '../services/itemService';
import { contentToText, langTextsToText } from '../types/languageFunctions';

import Categories from './Categories';
import Description from './Description';
import ItemsRow from './ItemsRow';

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
            <div>
                <table align='center' width={pageWidth}>
                    <tbody>
                        <tr>
                            <td className='alignCenter semiBold sizeExtremelyLarge' style={{ padding: '3rem', paddingBottom: '2rem' }}>
                                {langTextsToText(config.store.welcome, config)}
                            </td>
                        </tr>
                        <tr>
                            <td className='alignCenter sizeLarge' style={{ paddingBottom: '3rem' }}>
                                <Description config={config} />
                            </td>
                        </tr>
                        <tr>
                            <td className='pageHeader'>{contentToText(ContentID.itemsLatestItems, config)}</td>
                        </tr>
                        <tr>
                            <td className='noOuterPadding' style={{ padding: 0 }}>
                                <ItemsRow items={latestItems} colsPerRow={3} config={config} />
                            </td>
                        </tr>
                        <tr>
                            <td className='pageHeader' style={{ paddingTop: '4rem' }}>
                                {contentToText(ContentID.itemsTopSellers, config)}
                            </td>
                        </tr>
                        <tr>
                            <td className='noOuterPadding' style={{ padding: 0 }}>
                                <ItemsRow items={topSellers} colsPerRow={3} config={config} />
                            </td>
                        </tr>
                        <tr>
                            <td className='pageHeader' style={{ paddingTop: '4rem' }}>
                                {contentToText(ContentID.itemsAllCategories, config)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 0 }}>
                                <Categories showPageHeader={false} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <br />
            </div>
        </>
    );
};

export default MainPage;

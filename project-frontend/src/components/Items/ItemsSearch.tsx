import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Item } from '../../types/types';
import { RootState } from '../../redux/rootReducer';

import { contentToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';

import { useItemGetBySearchQueryQuery } from '../../redux/slices/itemSlice';

import BackButton from '../BackButton';
import InputField from '../InputField';
import ItemGrid from './ItemGrid';
import ItemsMenu from './ItemsMenu';

const ItemsSearch = () => {
    const config = useSelector((state: RootState) => state.config);

    const [attemptedToGetSearchParam, setAttemptedToGetSearchParam] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Item[]>([]);

    const searchField = useField('text', ContentID.miscSearch);

    const [searchParams] = useSearchParams();

    const itemGetBySearchQuery = useItemGetBySearchQueryQuery({ searchQuery: searchField.value.toString(), config: config });

    // Get search query from URL:
    useEffect(() => {
        if (!attemptedToGetSearchParam) {
            const query = searchParams.get('q');
            if (query) {
                searchField.setNewValue(query);
            }
            setAttemptedToGetSearchParam(true);
        }
    }, [attemptedToGetSearchParam, searchField, searchParams]);

    // Get Items that match the search query:
    useEffect(() => {
        if (attemptedToGetSearchParam && itemGetBySearchQuery.data) {
            setSearchResults(itemGetBySearchQuery.data);
        }
    }, [attemptedToGetSearchParam, itemGetBySearchQuery.data]);

    return (
        <>
            <ItemsMenu config={config} />
            <div className='pageWidth'>
                <div className='pageHeader'>{contentToText(ContentID.miscSearch, config)}</div>
                <div className='grid-container' data-gap='1.5rem'>
                    <InputField className='sizeLarge' useField={searchField} width='100%' placeHolder={contentToText(ContentID.searchItemsName, config)} />
                    <div className='alignLeft italic'>
                        {searchResults.length > 0 ? (
                            <>
                                {searchResults.length} {contentToText(ContentID.searchHits, config)}.
                            </>
                        ) : (
                            <>
                                {contentToText(ContentID.searchNoResults, config)} "{searchField.stringValue()}".
                            </>
                        )}
                    </div>
                    {searchResults.length > 0 && <ItemGrid config={config} items={searchResults} />}
                    <div className='alignLeft marginTop1_5'>
                        <BackButton type='button' />
                    </div>
                </div>
            </div>
            <br />
            <br />
        </>
    );
};

export default ItemsSearch;

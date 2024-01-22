import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import itemService from '../services/itemService';
import { contentToText } from '../types/languageFunctions';
import useField from '../hooks/useField';

import InputField from './InputField';
import ItemGrid from './ItemGrid';
import ItemsMenu from './ItemsMenu';

const ItemsSearch = () => {
    const config = useSelector((state: RootState) => state.config);

    const [attemptedToGetSearchParam, setAttemptedToGetSearchParam] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Item[]>([]);

    const searchField = useField('text', ContentID.miscSearch);

    const [searchParams] = useSearchParams();

    // Get search query from URL:
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            searchField.setNewValue(query);
        }
        setAttemptedToGetSearchParam(true);
    }, [searchParams]);

    // Get Items that match the search query:
    useEffect(() => {
        if (attemptedToGetSearchParam) {
            const fetch = async () => {
                setSearchResults(await itemService.getBySearchQuery(searchField.value.toString().trim(), config));
            };
            fetch();
        }
    }, [searchField.value]);

    return (
        <>
            <ItemsMenu config={config} />
            <div style={{ margin: 'auto', maxWidth: pageWidth }}>
                <div className='pageHeader'>{contentToText(ContentID.miscSearch, config)}</div>
                <InputField className='sizeLarge' useField={searchField} width='100%' placeHolder={contentToText(ContentID.searchItemsName, config)} />
                <div className='alignLeft italic' style={{ marginBottom: '1.25rem', marginTop: '1.25rem' }}>
                    {searchResults.length > 0 ? (
                        <>
                            {searchResults.length} {contentToText(ContentID.searchHits, config)}
                        </>
                    ) : (
                        <>
                            {contentToText(ContentID.searchNoResults, config)} "{searchField.stringValue()}".
                        </>
                    )}
                </div>
                {searchResults.length > 0 && <ItemGrid colsPerRow={3} config={config} items={searchResults} />}
            </div>
        </>
    );
};

export default ItemsSearch;

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import itemService from '../../services/itemService';
import { contentToText } from '../../types/languageFunctions';
import useField from '../../hooks/useField';

import InputField from '../InputField';
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
        if (attemptedToGetSearchParam) {
            const fetch = async () => {
                setSearchResults(await itemService.getBySearchQuery(searchField.value.toString().trim(), config));
            };
            fetch();
        }
    }, [attemptedToGetSearchParam, config, searchField.value]);

    return (
        <>
            <ItemsMenu config={config} />
            <div className='pageWidth'>
                <div className='pageHeader'>{contentToText(ContentID.miscSearch, config)}</div>
                <InputField className='sizeLarge' useField={searchField} width='100%' placeHolder={contentToText(ContentID.searchItemsName, config)} />
                <div className='alignLeft italic marginBottom1_25 marginTop1_25'>
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
            <br />
            <br />
        </>
    );
};

export default ItemsSearch;

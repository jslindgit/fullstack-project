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
import ItemsRow from './ItemsRow';

const ItemsSearch = () => {
    const config = useSelector((state: RootState) => state.config);

    const [attemptedToGetSearchParam, setAttemptedToGetSearchParam] = useState<boolean>(false);
    const [rows, setRows] = useState<Array<Item[]>>([]);
    const [searchResults, setSearchResults] = useState<Item[]>([]);

    const searchField = useField('text', ContentID.miscSearch);

    const [searchParams] = useSearchParams();

    const colsPerRow = 3;

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

    useEffect(() => {
        const allRows: Array<Item[]> = [];
        let currentRow: Item[] = [];
        searchResults.forEach((item) => {
            if (currentRow.length >= colsPerRow) {
                allRows.push(currentRow);
                currentRow = [];
            }
            currentRow.push(item);
        });
        if (currentRow.length > 0) {
            allRows.push(currentRow);
        }

        setRows(allRows);
    }, [searchResults]);

    return (
        <>
            <div>
                <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                    <tbody>
                        <tr>
                            <td>
                                <InputField useField={searchField} width='100%' placeHolder={contentToText(ContentID.searchItemsName, config)} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 0, paddingBottom: '1rem' }}>
                                {searchResults.length} {contentToText(ContentID.searchHits, config)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {rows.length <= 0 ? (
                    <div>
                        {contentToText(ContentID.searchNoResults, config)} "{searchField.stringValue()}"
                    </div>
                ) : (
                    <table align='center' width={pageWidth} className='noOuterPadding'>
                        <tbody>
                            {rows.map((row, index) => (
                                <ItemsRow key={index} items={row} colsPerRow={colsPerRow} config={config} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default ItemsSearch;

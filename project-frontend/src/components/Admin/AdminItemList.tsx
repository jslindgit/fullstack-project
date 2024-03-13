import { useEffect, useState } from 'react';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { Item } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { itemInStockTotal } from '../../util/misc';

import AdminItemRow from './AdminItemRow';
import SortArrow from '../SortArrow';

interface ListProps {
    config: Config;
    deleteItem: (item: Item) => Promise<void>;
    items: Item[];
}
const AdminItemList = ({ config, deleteItem, items }: ListProps) => {
    type sortByOption = 'description' | 'id' | 'instock' | 'name' | 'price';

    const [sortBy, setSortBy] = useState<sortByOption>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortedItems, setSortedItems] = useState<Item[]>([]);

    // Sort the Items if 'sortBy' or 'sortDirection' have changed:
    useEffect(() => {
        const sortAndSet = () => {
            switch (sortBy) {
                case 'description':
                    setSortedItems(
                        [...items].sort((a, b) =>
                            sortDirection === 'asc'
                                ? langTextsToText(a.description, config).localeCompare(langTextsToText(b.description, config))
                                : langTextsToText(b.description, config).localeCompare(langTextsToText(a.description, config))
                        )
                    );
                    break;
                case 'id':
                    setSortedItems([...items].sort((a, b) => (sortDirection === 'asc' ? a.id - b.id : b.id - a.id)));
                    break;
                case 'instock':
                    setSortedItems(
                        [...items].sort((a, b) =>
                            sortDirection === 'asc' ? itemInStockTotal(a) - itemInStockTotal(b) : itemInStockTotal(b) - itemInStockTotal(a)
                        )
                    );
                    break;
                case 'name':
                    setSortedItems(
                        [...items].sort((a, b) =>
                            sortDirection === 'asc'
                                ? langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))
                                : langTextsToText(b.name, config).localeCompare(langTextsToText(a.name, config))
                        )
                    );
                    break;
                case 'price':
                    setSortedItems([...items].sort((a, b) => (sortDirection === 'asc' ? a.price - b.price : b.price - a.price)));
                    break;
                default:
                    //setItems(items);
                    break;
            }
        };

        sortAndSet();
    }, [config, items, sortBy, sortDirection]);

    const setSorting = (by: sortByOption) => {
        if (sortBy !== by) {
            setSortBy(by);
        } else {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
    };

    if (items.length < 1) {
        return <div className='alignCenter colorGrayDark semiBold sizeLarge'>{contentToText(ContentID.adminItemsNoProducts, config)}</div>;
    }
    const columnHeader = (label: ContentID, sortByOption: sortByOption) => (
        <div className='gridHeaderRowDarkGray' onClick={() => setSorting(sortByOption)}>
            <span
                className='clickable'
                title={contentToText(sortBy === sortByOption ? ContentID.miscClickToChangeSortingOrder : ContentID.miscClickToSortByThis, config)}
            >
                {contentToText(label, config)}
            </span>{' '}
            <SortArrow column={sortByOption} sortBy={sortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} config={config} />
        </div>
    );

    return (
        <>
            <div className='grid-container left middle padded1rem sizeSmallish' data-cols='admin-item-list'>
                {columnHeader(ContentID.miscName, 'name')}
                {columnHeader(ContentID.miscDescription, 'description')}
                {columnHeader(ContentID.itemsPrice, 'price')}
                {columnHeader(ContentID.itemsInStock, 'instock')}
                {columnHeader(ContentID.itemsId, 'id')}
                <div className='gridHeaderRowDarkGray gridSpan3'>{contentToText(ContentID.adminPanelImages, config)}</div>
                {sortedItems.map((item) => (
                    <AdminItemRow key={item.id} item={item} deleteItem={deleteItem} />
                ))}
            </div>
        </>
    );
};

export default AdminItemList;

import { useEffect, useState } from 'react';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { Item } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';

import AdminItemRow from './AdminItemRow';
import SortArrow from '../SortArrow';

interface ListProps {
    config: Config;
    deleteItem: (item: Item) => Promise<void>;
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}
const AdminItemList = ({ config, deleteItem, items, setItems }: ListProps) => {
    type sortByOption = 'description' | 'id' | 'instock' | 'name' | 'price';

    const [sortBy, setSortBy] = useState<sortByOption>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Sort the Items if 'sortBy' or 'sortDirection' have changed:
    useEffect(() => {
        sortAndSet();
    }, [sortBy, sortDirection]);

    const setSorting = (by: sortByOption) => {
        if (sortBy !== by) {
            setSortBy(by);
        } else {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
    };

    const sortAndSet = () => {
        switch (sortBy) {
            case 'description':
                setItems(
                    [...items].sort((a, b) =>
                        sortDirection === 'asc'
                            ? langTextsToText(a.description, config).localeCompare(langTextsToText(b.description, config))
                            : langTextsToText(b.description, config).localeCompare(langTextsToText(a.description, config))
                    )
                );
                break;
            case 'id':
                setItems([...items].sort((a, b) => (sortDirection === 'asc' ? a.id - b.id : b.id - a.id)));
                break;
            case 'instock':
                setItems([...items].sort((a, b) => (sortDirection === 'asc' ? a.instock - b.instock : b.instock - a.instock)));
                break;
            case 'name':
                setItems(
                    [...items].sort((a, b) =>
                        sortDirection === 'asc'
                            ? langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))
                            : langTextsToText(b.name, config).localeCompare(langTextsToText(a.name, config))
                    )
                );
                break;
            case 'price':
                setItems([...items].sort((a, b) => (sortDirection === 'asc' ? a.price - b.price : b.price - a.price)));
                break;
            default:
                setItems(items);
                break;
        }
    };

    if (items.length < 1) {
        return <div className='alignCenter colorGrayDark semiBold sizeLarge'>{contentToText(ContentID.adminItemsNoProducts, config)}</div>;
    }

    const columnHeader = (label: ContentID, sortByOption: sortByOption, widthByContent: boolean = false) => (
        <td className={widthByContent ? 'widthByContent' : ''} onClick={() => setSorting(sortByOption)}>
            <span
                className='clickable'
                title={contentToText(sortBy === sortByOption ? ContentID.miscClickToChangeSortingOrder : ContentID.miscClickToSortByThis, config)}
            >
                {contentToText(label, config)}
            </span>{' '}
            <SortArrow column={sortByOption} sortBy={sortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} config={config} />
        </td>
    );

    return (
        <table align='center' width='100%' className='headerRow sizeSmallish dotted adminItems'>
            <tbody>
                <tr className='bold'>
                    {columnHeader(ContentID.miscName, 'name', true)}
                    {columnHeader(ContentID.miscDescription, 'description', false)}
                    {columnHeader(ContentID.itemsPrice, 'price', true)}
                    {columnHeader(ContentID.itemsInStock, 'instock', true)}
                    {columnHeader(ContentID.itemsId, 'id', true)}
                    <td width='1px' style={{ paddingLeft: 0 }}>
                        {contentToText(ContentID.adminPanelImages, config)}
                    </td>
                    <td width='1px' style={{ paddingRight: 0 }}></td>
                    <td width='1px' style={{ paddingRight: 0 }}></td>
                </tr>
                {items.map((item) => (
                    <AdminItemRow key={item.id} item={item} deleteItem={deleteItem} />
                ))}
            </tbody>
        </table>
    );
};

export default AdminItemList;

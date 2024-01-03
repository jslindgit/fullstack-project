import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { Category, Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { contentToText, langTextsToText } from '../types/languageFunctions';
import { isNumber } from '../types/typeFunctions';

import ItemsMenu from './ItemsMenu';
import ItemsRow from './ItemsRow';

const Items = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);

    const [category, setCategory] = useState<Category | undefined>(undefined);
    const [rows, setRows] = useState<Array<Item[]>>([]);

    const navigate = useNavigate();

    const idParam = useParams().id;

    const colsPerRow = 3;

    // Get Category from URL:
    useEffect(() => {
        if (idParam) {
            const id = Number(idParam);
            const cat = isNumber(id) && !isNaN(id) ? categoryState.categories.find((c) => c.id === id) : undefined;

            if (!cat && miscState.loaded) {
                navigate('/shop');
            } else {
                setCategory(cat);
            }
        }
    }, [categoryState, idParam, miscState.loaded, navigate]);

    // Set the rows of Items:
    useEffect(() => {
        if (category) {
            const allRows: Array<Item[]> = [];
            let currentRow: Item[] = [];
            category.items.forEach((item) => {
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
        } else {
            setRows([]);
        }
    }, [category]);

    if (!category) {
        return <></>;
    }

    return (
        <>
            <div>
                <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                    <tbody>
                        <tr>
                            <td style={{ padding: 0 }}>
                                <ItemsMenu config={config} currentId={category.id} />
                            </td>
                        </tr>
                        <tr>
                            <td className='tight underlined'>
                                <h3 style={{ marginBottom: '2rem' }}>{langTextsToText(category.name, config)}</h3>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {category.items.length <= 0 ? (
                    <div>{contentToText(ContentID.itemsNoItemsInCategory, config)}</div>
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

export default Items;

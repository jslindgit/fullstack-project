import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Item } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { langTextsToText } from '../types/languageFunctions';
import { isNumber } from '../types/typeFunctions';

import ItemsMenu from './ItemsMenu';
import ItemsRow from './ItemsRow';

const Items = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);

    const navigate = useNavigate();

    const id = Number(useParams().id);
    const category = id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;

    useEffect(() => {
        if (miscState.loaded && category === undefined) {
            navigate('/shop');
        }
    }, [category, miscState.loaded, navigate]);

    if (!category) {
        return <></>;
    }

    const cols = 3;
    const rows: Array<Item[]> = [];
    for (let i = 0; i < categoryState.length; i += cols) {
        rows.push(category.items.slice(i, i + cols));
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
                    <div>No items in this category</div>
                ) : (
                    <table align='center' width={pageWidth} className='noOuterPadding'>
                        <tbody>
                            {rows.map((row, index) => (
                                <ItemsRow key={index} items={row} colsPerRow={cols} config={config} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default Items;

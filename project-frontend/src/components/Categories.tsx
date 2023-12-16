import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { Category } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import { pageWidth } from '../constants';

import { Link } from './CustomLink';
import { ContentID } from '../content';

interface CategoryProps {
    category: Category;
    config: Config;
}
const CategoryItem = ({ category, config }: CategoryProps) => {
    return (
        <td width='33.33%'>
            <Link to={'/shop/' + category.id}>
                <table align='center' width='100%' className='categoryLink'>
                    <tbody>
                        <tr>
                            <td>
                                <div className='sizeLarge' style={{ lineHeight: 1.5, marginBottom: '-0.5em' }}>
                                    {langTextsToText(category.name, config)}
                                </div>
                                <br />
                                <span className='sizeSmallish'>{langTextsToText(category.description, config)}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Link>
        </td>
    );
};

const addRemainingCols = (colstoAdd: number) => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < colstoAdd; i++) {
        result.push(<td key={'col' + i} width='33.33%'></td>);
    }
    return result;
};

interface CategoryRowProps {
    categories: Category[];
    colsPerRow: number;
    config: Config;
}
const CategoryRow = ({ categories, colsPerRow, config }: CategoryRowProps) => {
    const extraCols = addRemainingCols(colsPerRow - categories.length);
    return (
        <tr>
            {categories.map((c) => (
                <CategoryItem key={c.id} category={c} config={config} />
            ))}
            {extraCols}
        </tr>
    );
};

const Categories = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = contentToText(ContentID.menuProducts, config) + ' | ' + config.store.contactName;
    }, [config]);

    if (categoryState.categories.length < 1) {
        return (
            <div>
                <br />
                Looks like there are no products available yet.
            </div>
        );
    }

    const cols = 3;
    const rows: Array<Category[]> = [];
    for (let i = 0; i < categoryState.categories.length; i += cols) {
        rows.push(categoryState.categories.slice(i, i + cols));
    }

    return (
        <>
            <div>
                <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                    <tbody>
                        <tr>
                            <td className='pageHeader'>{contentToText(ContentID.menuProducts, config)}</td>
                        </tr>
                    </tbody>
                </table>
                <table align='center' width={pageWidth} className='noOuterPadding valignTop'>
                    <tbody>
                        {rows.map((r, index) => (
                            <CategoryRow key={index} categories={r} colsPerRow={cols} config={config} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Categories;

import { useSelector } from 'react-redux';

import { Category } from '../types/types';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import { pageWidth } from '../constants';

import { Link } from './CustomLink';
import { ContentID } from '../content';

interface CategoryProps {
    category: Category;
}
const CategoryItem = ({ category }: CategoryProps) => {
    return (
        <td width='33.33%'>
            <Link to={'/shop/' + category.id}>
                <table align='center' width='100%' className='categoryLink'>
                    <tbody>
                        <tr>
                            <td>
                                <span className='sizeLarge' style={{ lineHeight: 1.5 }}>
                                    {category.name}
                                </span>
                                <br />
                                <span className='sizeSmall'>{category.description}</span>
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
}
const CategoryRow = ({ categories, colsPerRow }: CategoryRowProps) => {
    const extraCols = addRemainingCols(colsPerRow - categories.length);
    return (
        <tr>
            {categories.map((c) => (
                <CategoryItem key={c.id} category={c} />
            ))}
            {extraCols}
        </tr>
    );
};

const Categories = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);

    const cols = 3;
    const rows: Array<Category[]> = [];
    for (let i = 0; i < categoryState.length; i += cols) {
        rows.push(categoryState.slice(i, i + cols));
    }

    return (
        <>
            <div>
                <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                    <tbody>
                        <tr>
                            <td className='pageHeader'>{contentToText(ContentID.menuProducts, configState)}</td>
                        </tr>
                    </tbody>
                </table>
                <table align='center' width={pageWidth} className='noOuterPadding'>
                    <tbody>
                        {rows.map((r, index) => (
                            <CategoryRow key={index} categories={r} colsPerRow={cols} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Categories;

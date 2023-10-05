import { useSelector } from 'react-redux';
import { Link } from './CustomLink';

import { Category } from '../types/types';
import { RootState } from '../reducers/rootReducer';

interface CategoryProps {
    category: Category;
}
const CategoryItem = ({ category }: CategoryProps) => {
    return (
        <td>
            <Link to={'/shop/' + category.id}>
                <table align='center' width='100%' className='categoryLink'>
                    <tbody>
                        <tr>
                            <td className='menuLink'>
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

interface CategoryRowProps {
    categories: Category[];
}
const CategoryRow = ({ categories }: CategoryRowProps) => {
    return (
        <tr>
            {categories.map((c) => (
                <CategoryItem key={c.id} category={c} />
            ))}
        </tr>
    );
};

const Categories = () => {
    const categoryState = useSelector((state: RootState) => state.categories);

    const cols = 3;
    const rows: Array<Category[]> = [];
    for (let i = 0; i < categoryState.length; i += cols) {
        rows.push(categoryState.slice(i, i + cols));
    }

    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        {rows.map((r, index) => (
                            <CategoryRow key={index} categories={r} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Categories;

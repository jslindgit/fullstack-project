import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { RootState } from '../../reducers/rootReducer';

import { langTextsToText } from '../../types/languageFunctions';

interface Props {
    config: Config;
    selectedCategories: number[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
}
const ItemEditCategories = ({ config, selectedCategories, setSelectedCategories }: Props) => {
    const categoriesState = useSelector((state: RootState) => state.categories);

    const handleCategoryChange = (categoryId: number) => {
        const updatedCategories = [...selectedCategories];

        if (updatedCategories.includes(categoryId)) {
            const index = updatedCategories.indexOf(categoryId);
            updatedCategories.splice(index, 1);
        } else {
            updatedCategories.push(categoryId);
        }
        setSelectedCategories(updatedCategories);
    };

    return (
        <>
            {categoriesState.categories.map((c) => (
                <button
                    key={c.id}
                    type='button'
                    className={'selectButton ' + (selectedCategories.includes(c.id) ? 'selectButtonTrue' : 'selectButtonFalse')}
                    onClick={() => handleCategoryChange(c.id)}
                >
                    {langTextsToText(c.name, config)}
                </button>
            ))}
        </>
    );
};

export default ItemEditCategories;

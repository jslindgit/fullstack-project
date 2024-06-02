import { useEffect } from 'react';

import { Config } from '../../types/configTypes';

import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { useCategoryGetAllQuery } from '../../redux/categorySlice';
import { ContentID } from '../../content';

interface Props {
    config: Config;
    initialCategories: number[] | undefined;
    selectedCategories: number[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
}
const ItemEditCategories = ({ config, initialCategories, selectedCategories, setSelectedCategories }: Props) => {
    const categoryGetAll = useCategoryGetAllQuery();

    useEffect(() => {
        if (initialCategories) {
            setSelectedCategories(initialCategories);
        }
    }, [initialCategories, setSelectedCategories]);

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
            {categoryGetAll.data ? (
                categoryGetAll.data.map((c) => (
                    <button
                        key={c.id}
                        type='button'
                        className={'selectButton ' + (selectedCategories.includes(c.id) ? 'selectButtonTrue' : 'selectButtonFalse')}
                        onClick={() => handleCategoryChange(c.id)}
                    >
                        {langTextsToText(c.name, config)}
                    </button>
                ))
            ) : (
                <>{contentToText(ContentID.miscLoading, config)}</>
            )}
        </>
    );
};

export default ItemEditCategories;

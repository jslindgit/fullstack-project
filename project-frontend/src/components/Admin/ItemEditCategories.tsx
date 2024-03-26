import { useEffect, useState } from 'react';

import { Config } from '../../types/configTypes';
import { Category } from '../../types/types';

import categoryService from '../../services/categoryService';
import { langTextsToText } from '../../types/languageFunctions';

interface Props {
    config: Config;
    initialCategories: number[] | undefined;
    selectedCategories: number[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
}
const ItemEditCategories = ({ config, initialCategories, selectedCategories, setSelectedCategories }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch the categories from server:
    useEffect(() => {
        const fetch = async () => {
            const fetchedCategories = await categoryService.getAll();
            setCategories(fetchedCategories.sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))));
        };

        fetch();
    }, [config]);

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
            {categories.map((c) => (
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

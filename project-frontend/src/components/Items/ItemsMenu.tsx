import { useEffect, useState } from 'react';

import { ContentID } from '../../content';
import { Config } from '../../types/configTypes';
import { Category } from '../../types/types';

import categoryService from '../../services/categoryService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { Link } from '../CustomLink';

interface Props {
    config: Config;
    currentId?: number;
}

const ItemsMenu = ({ config, currentId }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const baseUrl = '/shop/';

    // Fetch the categories from server:
    useEffect(() => {
        const fetch = async () => {
            setCategories(await categoryService.getAll());
        };

        fetch();
    }, [config]);

    return (
        <div className='divCenter flex-container marginBottom1_25 marginTop1 noWrap sizeLarge' data-gap='1rem 2rem' data-justify='center'>
            {categories.length > 0 ? (
                <>
                    {categories.map((c) => (
                        <div key={c.id} className={currentId === c.id ? ' currentPage semiBold' : ''}>
                            {currentId === c.id ? langTextsToText(c.name, config) : <Link to={baseUrl + c.id}>{langTextsToText(c.name, config)}</Link>}
                        </div>
                    ))}
                </>
            ) : (
                <div>{contentToText(ContentID.miscLoading, config)}</div>
            )}
        </div>
    );
};

export default ItemsMenu;

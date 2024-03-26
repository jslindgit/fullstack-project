import { Config } from '../../types/configTypes';
import { Category } from '../../types/types';

import { langTextsToText } from '../../types/languageFunctions';

import { Link } from '../CustomLink';

interface Props {
    categories: Category[];
    config: Config;
    currentId?: number;
}

const ItemsMenu = ({ categories, config, currentId }: Props) => {
    const baseUrl = '/shop/';

    return (
        <div className='divCenter flex-container marginBottom1_25 marginTop1 noWrap sizeLarge' data-gap='2rem' data-justify='center'>
            {categories.map((c) => (
                <div key={c.id} className={currentId === c.id ? ' currentPage semiBold' : ''}>
                    {currentId === c.id ? langTextsToText(c.name, config) : <Link to={baseUrl + c.id}>{langTextsToText(c.name, config)}</Link>}
                </div>
            ))}
        </div>
    );
};

export default ItemsMenu;

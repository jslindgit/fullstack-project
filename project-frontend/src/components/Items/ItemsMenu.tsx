import { Config } from '../../types/configTypes';

import { langTextsToText } from '../../types/languageFunctions';

import { useCategoryGetAllQuery } from '../../redux/categorySlice';

import { Link } from '../CustomLink';
import LoadingQuery from '../LoadingQuery';

interface Props {
    config: Config;
    currentId?: number;
}

const ItemsMenu = ({ config, currentId }: Props) => {
    const categoryGetAll = useCategoryGetAllQuery();

    const baseUrl = '/shop/';

    if (!categoryGetAll.data) {
        return <LoadingQuery query={categoryGetAll} config={config} />;
    }

    return (
        <div className='divCenter flex-container marginBottom1_25 marginTop1 noWrap sizeLarge' data-gap='1rem 2rem' data-justify='center'>
            {categoryGetAll.data.map((c) => (
                <div key={c.id} className={currentId === c.id ? ' currentPage semiBold' : ''}>
                    {currentId === c.id ? langTextsToText(c.name, config) : <Link to={baseUrl + c.id}>{langTextsToText(c.name, config)}</Link>}
                </div>
            ))}
        </div>
    );
};

export default ItemsMenu;

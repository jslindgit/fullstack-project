import { ContentID } from '../../content';
import { Config } from '../../types/configTypes';

import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { useCategoryGetAllQuery } from '../../redux/categorySlice';

import { Link } from '../CustomLink';
import Loading from '../Loading';

interface Props {
    config: Config;
    currentId?: number;
}

const ItemsMenu = ({ config, currentId }: Props) => {
    const categoryGetAll = useCategoryGetAllQuery();

    const baseUrl = '/shop/';

    if (!categoryGetAll.data) {
        return <Loading config={config} text={contentToText(categoryGetAll.isLoading ? ContentID.miscLoading : ContentID.errorSomethingWentWrong, config)} />;
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

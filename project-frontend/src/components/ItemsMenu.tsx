import { useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { RootState } from '../reducers/rootReducer';

import { langTextsToText } from '../types/languageFunctions';

import { Link } from './CustomLink';

interface Props {
    config: Config;
    currentId?: number;
}

const ItemsMenu = ({ config, currentId }: Props) => {
    const baseUrl = '/shop/';

    const categoryState = useSelector((state: RootState) => state.categories);

    return (
        <div style={{ margin: 'auto', marginBottom: '2.5rem', marginTop: '1rem', width: 'min-content' }}>
            <div className='grid-container noWrap sizeLarge' data-cols='auto' data-gap='2rem'>
                {categoryState.categories.map((c) => (
                    <div key={c.id} className={currentId === c.id ? 'currentPage semiBold' : ''}>
                        {currentId === c.id ? langTextsToText(c.name, config) : <Link to={baseUrl + c.id}>{langTextsToText(c.name, config)}</Link>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemsMenu;

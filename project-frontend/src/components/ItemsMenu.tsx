import { useSelector } from 'react-redux';

import { Config } from '../types/configTypes';
import { RootState } from '../reducers/rootReducer';

import { langTextsToText } from '../types/languageFunctions';

import { Link } from './CustomLink';

interface Props {
    config: Config;
    currentId: number;
}

const ItemsMenu = ({ config, currentId }: Props) => {
    const baseUrl = '/shop/';

    const categoryState = useSelector((state: RootState) => state.categories);

    return (
        <div>
            <table align='center' className='sizeLarge'>
                <tbody>
                    <tr>
                        {categoryState.map((c) => (
                            <td key={c.id} className={currentId === c.id ? 'currentPage semiBold' : ''}>
                                {currentId === c.id ? langTextsToText(c.name, config) : <Link to={baseUrl + c.id}>{langTextsToText(c.name, config)}</Link>}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ItemsMenu;

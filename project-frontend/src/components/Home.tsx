import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';
import { langTextsToText } from '../types/languageFunctions';

import { description } from '../constants';

const MainPage = () => {
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = config.store.contactName;
    }, [config]);

    return (
        <>
            <div>
                <table align='center' width={pageWidth}>
                    <tbody>
                        <tr>
                            <td className='alignCenter semiBold sizeExtremelyLarge' style={{ padding: '3rem', paddingBottom: '2rem' }}>
                                {langTextsToText(config.store.welcome, config)}
                            </td>
                        </tr>
                        <tr>
                            <td className='alignCenter sizeLarge'>{description(config)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MainPage;

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';

const MainPage = () => {
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = config.store.contactName;
    }, [config]);

    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <h2>{contentToText(ContentID.homeWelcome, config)}</h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MainPage;

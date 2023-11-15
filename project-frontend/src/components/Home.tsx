import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';

const MainPage = () => {
    const configState = useSelector((state: RootState) => state.config);

    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <h2>{contentToText(ContentID.homeWelcome, configState)}</h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MainPage;

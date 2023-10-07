import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

const MainPage = () => {
    const configState = useSelector((state: RootState) => state.config);

    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <h1>Welcome to {configState.store.name}</h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MainPage;

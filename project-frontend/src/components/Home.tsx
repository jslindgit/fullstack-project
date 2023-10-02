import '../App.css';

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
                                <h2>Welcome to {configState.storeName}</h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MainPage;

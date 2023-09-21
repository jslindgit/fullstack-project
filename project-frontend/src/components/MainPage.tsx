import '../App.css';
import { Config } from '../types/types';

interface Props {
    config: Config;
}

const MainPage = ({ config }: Props) => {
    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <h2>Welcome to {config.storeName}</h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MainPage;

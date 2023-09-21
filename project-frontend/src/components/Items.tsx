import '../App.css';
import { Category, Item } from '../types';

interface Props {
    categories: Category[];
    categoryId: number;
}

const Items = ({ categories, categoryId }: Props) => {
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

export default Items;

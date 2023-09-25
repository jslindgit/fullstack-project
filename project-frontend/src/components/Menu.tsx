import { Link } from 'react-router-dom';

import '../App.css';
import { Category } from '../types/types';

interface Props {
    categories: Category[];
}

const Menu = ({ categories }: Props) => {
    return (
        <>
            <div>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <Link to='/'>
                                    <h3>Main Page</h3>
                                </Link>
                            </td>
                            {categories.map((c) => (
                                <td key={c.id}>
                                    <Link to={'/products/' + c.id}>
                                        <h3>{c.name}</h3>
                                    </Link>
                                </td>
                            ))}
                            <td>
                                <Link to='/login'>
                                    <h3>Login</h3>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

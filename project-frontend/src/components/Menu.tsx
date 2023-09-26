import { Link } from 'react-router-dom';

import '../App.css';
import { Category } from '../types/types';
import { getLoggedUser } from '../util/logged_handler';
import loginService from '../services/loginService';

const login = () => {
    const loggedUser = getLoggedUser();

    console.log('loggedUser:', loggedUser);

    if (loggedUser) {
        return (
            <>
                Logged in as {loggedUser?.username}
                <br />
                <Link to='/' onClick={() => loginService.logout} />
            </>
        );
    } else {
        return (
            <Link to='/login'>
                <h3>Login</h3>
            </Link>
        );
    }
};

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
                                    <h3>Home</h3>
                                </Link>
                            </td>
                            {categories.map((c) => (
                                <td key={c.id}>
                                    <Link to={'/products/' + c.id}>
                                        <h3>{c.name}</h3>
                                    </Link>
                                </td>
                            ))}
                            <td>{login()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

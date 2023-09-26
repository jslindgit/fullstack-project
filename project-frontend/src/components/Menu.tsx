import { Link } from 'react-router-dom';

import '../App.css';
import { Category, LoggedUser } from '../types/types';
import loginService from '../services/loginService';

const login = (loggedUser: LoggedUser | null, setLoggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>) => {
    if (loggedUser) {
        return (
            <>
                Logged in as {loggedUser?.username}
                {loggedUser.admin ? <> (Admin)</> : <></>}
                <br />
                <Link to='#' onClick={async () => await loginService.logout(loggedUser.token, setLoggedUser)}>
                    Logout
                </Link>
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
    loggedUser: LoggedUser | null;
    setLoggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
}

const Menu = ({ categories, loggedUser, setLoggedUser }: Props) => {
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
                            <td>{login(loggedUser, setLoggedUser)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Menu;

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { RootState } from '../reducers/root_reducer';

import '../App.css';

interface Props {
    loaded: boolean;
}

const UserPanel = ({ loaded }: Props) => {
    const usersState = useSelector((state: RootState) => state.users);

    const navigate = useNavigate();

    const user = usersState.loggedUser;

    useEffect(() => {
        if (loaded && (!user || user === null)) {
            navigate('/login');
        }
    }, [user, navigate, loaded]);

    if (user) {
        return (
            <>
                <div>
                    <table align='center'>
                        <tbody>
                            <tr>
                                <td>
                                    <h2>
                                        {user.name}
                                        {user.admin ? <> (Admin)</> : <></>}
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>{user.username}</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Customer ID: {user.id}
                                    {user.disabled ? (
                                        <>
                                            <br />
                                            <b>This account has been disabled.</b>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
};

export default UserPanel;

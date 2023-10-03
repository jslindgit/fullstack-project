import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { RootState } from '../reducers/rootReducer';

const UserPanel = () => {
    const miscState = useSelector((state: RootState) => state.misc);
    const usersState = useSelector((state: RootState) => state.users);

    const navigate = useNavigate();

    const user = usersState.loggedUser;

    useEffect(() => {
        if (miscState.loaded && (!user || user === null)) {
            navigate('/login');
        }
    }, [user, navigate, miscState.loaded]);

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

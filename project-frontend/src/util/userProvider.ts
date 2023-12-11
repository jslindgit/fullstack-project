import { AnyAction, Dispatch } from 'redux';

import { Config } from '../types/configTypes';
import { NewUser, User } from '../types/types';

import loginService from '../services/loginService';
import userService from '../services/userService';

import { setNotification } from '../reducers/miscReducer';
import { setLoggedUser } from '../reducers/userReducer';

export const registerAndLogin = async (newUser: NewUser, password: string, config: Config, dispatch: Dispatch<AnyAction>) => {
    const response = await userService.addNew(newUser, config);

    // If the registration was successful, login with the registered user:
    if (response.success && response.user) {
        const setLogged = (loggedUser: User) => {
            dispatch(setLoggedUser(loggedUser));
        };

        await loginService.login(response.user.username, password, setLogged, config);
    }

    dispatch(setNotification({ message: response.message, tone: response.success ? 'Positive' : 'Negative' }));
};

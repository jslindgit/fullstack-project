import { AnyAction, Dispatch } from 'redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { NewUser, User } from '../types/types';

import { contentToText } from '../types/languageFunctions';
import loginService from '../services/loginService';
import userService from '../services/userService';

import { setNotification } from '../redux/miscReducer';
import { setLoggedUser } from '../redux/userReducer';

export const getUserStatus = (user: User, config: Config): string => {
    if (user.admin) {
        return contentToText(ContentID.userStatusAdmin, config);
    } else if (user.operator) {
        return contentToText(ContentID.userStatusOperator, config);
    } else {
        return contentToText(ContentID.userStatusCustomer, config) + (user.disabled ? ` (${contentToText(ContentID.userDisabled, config)})` : '');
    }
};

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

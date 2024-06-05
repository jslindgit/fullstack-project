import { AnyAction, Dispatch } from 'redux';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { StoreDispatch } from '../redux/store';
import { NewUser, User } from '../types/types';

import { contentToText } from '../types/languageFunctions';

import { login } from '../redux/loginSlice';
import { setNotification } from '../redux/miscReducer';
import { setLoggedUser } from '../redux/userReducer';
import { userAdd } from '../redux/userSlice';

export const getUserStatus = (user: User, config: Config): string => {
    if (user.admin) {
        return contentToText(ContentID.userStatusAdmin, config);
    } else if (user.operator) {
        return contentToText(ContentID.userStatusOperator, config);
    } else {
        return contentToText(ContentID.userStatusCustomer, config) + (user.disabled ? ` (${contentToText(ContentID.userDisabled, config)})` : '');
    }
};

export const registerAndLogin = async (newUser: NewUser, password: string, config: Config, dispatch: Dispatch<AnyAction>, storeDispatch: StoreDispatch) => {
    const res = await storeDispatch(userAdd.initiate({ toAdd: newUser, config: config })).unwrap();

    // If the registration was successful, login with the registered user:
    if (res.success && res.user) {
        const setLogged = (loggedUser: User) => {
            dispatch(setLoggedUser(loggedUser));
        };

        //await loginService.login(res.user.username, password, setLogged, config);
        await storeDispatch(login.initiate({ username: res.user.username, password: password, setLoggedUser: setLogged, config: config })).unwrap();
    }

    dispatch(setNotification({ message: res.message, tone: res.success ? 'Positive' : 'Negative' }));
};

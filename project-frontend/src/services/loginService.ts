import axios, { AxiosError } from 'axios';

import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { isUser } from '../types/typeFunctions';
import { LoginResponse, Response, User } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import { contentToText } from '../types/languageFunctions';
import localstorage_handler from '../util/localstorageHandler';
import { apiKeyConfig } from '../util/serviceProvider';

const url = apiBaseUrl + '/login';

const changePassword = async (username: string, currentPassword: string, newPassword: string, config: Config): Promise<Response> => {
    try {
        const res = await axios.post(url + '/changepassword', { username: username, password: currentPassword, newPassword: newPassword }, apiKeyConfig());

        if (res.status === 200) {
            return { success: true, message: contentToText(ContentID.loginPasswordChangedSuccessfully, config) };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config) };
        }
    } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 401) {
            return { success: false, message: contentToText(ContentID.loginInvalidUsernameOrPassword, config) };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config) };
        }
    }
};

const login = async (username: string, password: string, setLoggedUser: (loggedUser: User) => void, config: Config): Promise<LoginResponse> => {
    try {
        const res = await axios.post(url, { username: username, password: password }, apiKeyConfig());

        if (res.status === 200 && isUser(res.data.response)) {
            localstorage_handler.setToken(res.data.response.token);
            setLoggedUser(res.data.response);
            return { success: true, message: contentToText(ContentID.loginLoggedInAs, config) + res.data.response.username };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config) };
        }
    } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.status === 401) {
            return { success: false, message: contentToText(ContentID.loginInvalidUsernameOrPassword, config) };
        } else {
            return { success: false, message: contentToText(ContentID.errorSomethingWentWrong, config) };
        }
    }
};

const logout = async (token: string, removeLoggedUser: () => void) => {
    localstorage_handler.removeToken();
    removeLoggedUser();

    try {
        await axios.delete(url, {
            headers: {
                Authorization: 'bearer ' + token,
            },
        });
    } catch (err: unknown) {
        handleError(err);
    }
};

export default {
    changePassword,
    login,
    logout,
};

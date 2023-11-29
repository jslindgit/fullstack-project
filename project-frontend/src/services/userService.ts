import axios from 'axios';

import { NewUser, User } from '../types/types';

import { apiBaseUrl } from '../constants';
import { handleError } from '../util/handleError';
import { apiKeyConfig, authConfig } from '../util/serviceProvider';
import { isUser } from '../types/typeFunctions';

const url = apiBaseUrl + '/users';

const addNew = async (newUser: NewUser): Promise<User | null> => {
    try {
        const { data } = await axios.post(url, newUser, apiKeyConfig());
        if (isUser(data)) {
            return data;
        } else {
            handleError('Server did not return an User');
            return null;
        }
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getById = async (id: number) => {
    try {
        const { data } = await axios.get<User>(`${url}/${id}`);
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

const getByToken = async (token: string) => {
    try {
        const { data } = await axios.get<User>(`${url}/me`, authConfig(token));
        return data;
    } catch (err: unknown) {
        handleError(err);
    }
};

export default {
    addNew,
    getById,
    getByToken,
};

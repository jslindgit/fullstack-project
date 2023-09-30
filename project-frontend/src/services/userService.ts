import axios from 'axios';

import { User } from '../types/types';

import { apiBaseUrl } from '../constants';
import { authConfig } from '../util/service_provider';
import { handleError } from '../util/error_handler';

const url = apiBaseUrl + '/users';

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
    getById,
    getByToken,
};

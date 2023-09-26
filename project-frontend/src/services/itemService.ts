import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { Item as Interface } from '../types/types';

const url = apiBaseUrl + '/items';

const add = async (): Promise<string> => {
    // TODO: post a new item to server
    return 'temp response';
};

const deleteById = async (id: number) => {
    const { data } = await axios.delete<Interface>(`${url}/${id}`);
    return data;
};

const getAll = async () => {
    const { data } = await axios.get<Interface[]>(url);
    return data;
};

const getById = async (id: number) => {
    const { data } = await axios.get<Interface>(`${url}/${id}`);
    return data;
};

export default {
    add,
    deleteById,
    getAll,
    getById,
};

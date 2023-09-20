import axios from 'axios';

import { apiBaseUrl } from '../constants';
import { Category as Interface } from '../types';

const url = apiBaseUrl + '/categories';

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
    deleteById,
    getAll,
    getById,
};

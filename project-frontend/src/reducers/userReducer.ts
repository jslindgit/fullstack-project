import { Dispatch } from 'react';
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../types/types';

import userService from '../services/userService';

export interface UserState {
    loggedUser: User | null;
    token: string | null;
}

const initialState: UserState = {
    loggedUser: null,
    token: null,
};

const saveTokenToLocalStorage = (token: string | null) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        removeLoggedUser(state: UserState, _action: PayloadAction) {
            state.loggedUser = null;
            state.token = null;

            saveTokenToLocalStorage(null);
        },
        setLoggedUser(state: UserState, action: PayloadAction<User>) {
            state.loggedUser = action.payload;
            state.token = action.payload.token;

            saveTokenToLocalStorage(action.payload.token);
        },
        setToken(state: UserState, action: PayloadAction<string | null>) {
            state.token = action.payload;

            saveTokenToLocalStorage(action.payload);
        },
    },
});

export const initializeLoggedUser = async (dispatch: Dispatch<AnyAction>) => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
        const user = await userService.getByToken(storedToken);

        if (user) {
            dispatch(setToken(storedToken));
            dispatch(setLoggedUser(user));
        } else {
            dispatch(setToken(null));
            dispatch(removeLoggedUser());
        }
    }
};

export const { removeLoggedUser, setLoggedUser, setToken } = slice.actions;
export default slice.reducer;

import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

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

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        removeLoggedUser(state: UserState, _action: PayloadAction) {
            state.loggedUser = null;
            state.token = null;
        },
        setLoggedUser(state: UserState, action: PayloadAction<User>) {
            state.loggedUser = action.payload;
            state.token = action.payload.token;
        },
        setToken(state: UserState, action: PayloadAction<string | null>) {
            state.token = action.payload;
        },
    },
});

export const initializeLoggedUser = async (dispatch: Dispatch<AnyAction>) => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
        const userResponse = await userService.getByToken(storedToken);

        if (userResponse.user) {
            dispatch(slice.actions.setToken(storedToken));
            dispatch(setLoggedUser(userResponse.user));
        } else {
            dispatch(slice.actions.setToken(null));
            dispatch(removeLoggedUser());
            localStorage.removeItem('token');
        }
    }
};

export const saveTokenToLocalStorage = (state: UserState) => {
    if (state.token) {
        localStorage.setItem('token', state.token);
    } else {
        localStorage.removeItem('token');
    }
};

export const { removeLoggedUser, setLoggedUser } = slice.actions;
export default slice.reducer;

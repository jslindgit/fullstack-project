import { AnyAction, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { StoreDispatch } from './store';
import { User } from '../types/types';

import { userGetByToken } from './slices/userSlice';

export interface UserState {
    initialized: boolean;
    loggedUser: User | null;
    token: string | null;
}

const initialState: UserState = {
    initialized: false,
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
        setInitialized(state: UserState, action: PayloadAction<boolean>) {
            state.initialized = action.payload;
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

export const initializeLoggedUser = async (dispatch: Dispatch<AnyAction>, storeDispatch: StoreDispatch) => {
    const storedToken = localStorage.getItem('token');

    const unsuccessful = () => {
        dispatch(slice.actions.setToken(null));
        dispatch(removeLoggedUser());
        localStorage.removeItem('token');
    };

    if (storedToken) {
        try {
            const userResponse = await storeDispatch(userGetByToken.initiate({ token: storedToken })).unwrap();

            if (userResponse) {
                dispatch(slice.actions.setToken(storedToken));
                dispatch(setLoggedUser(userResponse));
            } else {
                unsuccessful();
            }
        } catch (err: unknown) {
            unsuccessful();
        }
    }

    dispatch(slice.actions.setInitialized(true));
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

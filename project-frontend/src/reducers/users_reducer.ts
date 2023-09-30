import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../types/types';

export interface UsersState {
    loggedUser: User | null;
}

const initialState: UsersState = {
    loggedUser: null,
};

const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        removeLoggedUser(state: UsersState, _action: PayloadAction) {
            state.loggedUser = null;
        },
        setLoggedUser(state: UsersState, action: PayloadAction<User>) {
            state.loggedUser = action.payload;
        },
    },
});

export const { removeLoggedUser, setLoggedUser } = slice.actions;
export default slice.reducer;

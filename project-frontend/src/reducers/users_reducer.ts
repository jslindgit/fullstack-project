import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoggedUser } from '../types/types';

export interface UsersState {
    loggedUser: LoggedUser | null;
}

const initialState: UsersState = {
    loggedUser: null,
};

const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setLoggedUser(state: UsersState, action: PayloadAction<LoggedUser | null>) {
            state.loggedUser = action.payload;
        },
    },
});

export const { setLoggedUser } = slice.actions;
export default slice.reducer;

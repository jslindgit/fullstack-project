import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Notification, NewNotification } from '../types/types';

export interface MiscState {
    loaded: boolean;
    notification: Notification | null;
}

const initialState: MiscState = {
    loaded: false,
    notification: null,
};

const slice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setLoaded(state: MiscState, action: PayloadAction<boolean>) {
            state.loaded = action.payload;
        },
        setNotification(state: MiscState, action: PayloadAction<NewNotification | null>) {
            state.notification = action.payload ? { ...action.payload, renders: 1 } : null;
        },
        tickNotification(state: MiscState, _action: PayloadAction) {
            if (state.notification) {
                state.notification.renders--;

                if (state.notification.renders <= 0) {
                    state.notification = null;
                }
            }
        },
    },
});

export const { setLoaded, setNotification, tickNotification } = slice.actions;
export default slice.reducer;

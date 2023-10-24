import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Notification, NewNotification } from '../types/types';

import localstorageHandler from '../util/localstorageHandler';

export interface MiscState {
    loaded: boolean;
    notification: Notification | null;
    shoppingCartItemCount: number;
}

const initialState: MiscState = {
    loaded: false,
    notification: null,
    shoppingCartItemCount: 0,
};

const slice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        refreshShoppingCartItemCount(state: MiscState, _action: PayloadAction) {
            state.shoppingCartItemCount = localstorageHandler.getShoppingCart().reduce((total, shoppingCartItem) => total + shoppingCartItem.quantity, 0);
        },
        setLoaded(state: MiscState, action: PayloadAction<boolean>) {
            state.loaded = action.payload;
        },
        setNotification(state: MiscState, action: PayloadAction<NewNotification>) {
            state.notification = { ...action.payload, renders: 1 };
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

export const { refreshShoppingCartItemCount, setLoaded, setNotification, tickNotification } = slice.actions;
export default slice.reducer;

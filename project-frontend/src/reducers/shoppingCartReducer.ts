import { Dispatch } from 'react';
import { AnyAction, createSlice, current, PayloadAction } from '@reduxjs/toolkit';

import { ShoppingItem } from '../types/orderTypes';

interface QuantityUpdate {
    itemIndex: number;
    newQuantity: number;
}

export interface ShoppingCartState {
    shoppingItems: ShoppingItem[];
}

const initialState: ShoppingCartState = {
    shoppingItems: [],
};

const saveToLocalStorage = (state: ShoppingCartState) => {
    localStorage.setItem('shoppingCart', JSON.stringify(state.shoppingItems));
};

const slice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducers: {
        addItemToShoppingCart(state: ShoppingCartState, action: PayloadAction<ShoppingItem>) {
            const existingItem = current(state).shoppingItems.find((si) => si.id === action.payload.id);
            if (existingItem) {
                const updatedShoppingItems = current(state).shoppingItems.filter((item) => item !== existingItem);
                updatedShoppingItems.push({ ...existingItem, quantity: existingItem.quantity + action.payload.quantity });
                state.shoppingItems = updatedShoppingItems;
            } else {
                state.shoppingItems.push(action.payload);
            }

            saveToLocalStorage(state);
        },
        removeAllFromShoppingCart(state: ShoppingCartState, _action: PayloadAction) {
            state.shoppingItems = [];

            saveToLocalStorage(state);
        },
        removeItemFromShoppingCart(state: ShoppingCartState, action: PayloadAction<ShoppingItem>) {
            const updatedShoppingItems = current(state).shoppingItems.filter((item) => item !== action.payload);
            state.shoppingItems = updatedShoppingItems;

            saveToLocalStorage(state);
        },
        setShoppingCart(state: ShoppingCartState, action: PayloadAction<ShoppingItem[]>) {
            state.shoppingItems = action.payload;

            saveToLocalStorage(state);
        },
        updateShoppingCartItemQuantity(state: ShoppingCartState, action: PayloadAction<QuantityUpdate>) {
            state.shoppingItems[action.payload.itemIndex].quantity = action.payload.newQuantity;

            saveToLocalStorage(state);
        },
    },
});

export const initializeShoppingCart = (dispatch: Dispatch<AnyAction>) => {
    const storedShoppingCartString = localStorage.getItem('shoppingCart');

    if (storedShoppingCartString) {
        const storedShoppingCart: Array<ShoppingItem> = JSON.parse(storedShoppingCartString);
        dispatch(setShoppingCart(storedShoppingCart));
    } else {
        dispatch(removeAllFromShoppingCart());
    }
};

export const { addItemToShoppingCart, removeAllFromShoppingCart, removeItemFromShoppingCart, setShoppingCart, updateShoppingCartItemQuantity } = slice.actions;
export default slice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
            const existingItem = state.shoppingItems.find((si) => si.id === action.payload.id && si.price === action.payload.price);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.shoppingItems.push(action.payload);
            }

            saveToLocalStorage(state);
        },
        loadShoppingCartFromLocalStorage(state: ShoppingCartState, _action: PayloadAction) {
            const storedShoppingCartString = localStorage.getItem('shoppingCart');
            if (storedShoppingCartString) {
                const storedShoppingCart: Array<ShoppingItem> = JSON.parse(storedShoppingCartString);
                state.shoppingItems = storedShoppingCart;
            } else {
                state.shoppingItems = [];
            }
        },
        removeAllFromShoppingCart(state: ShoppingCartState, _action: PayloadAction) {
            state.shoppingItems = [];

            saveToLocalStorage(state);
        },
        removeItemFromShoppingCart(state: ShoppingCartState, action: PayloadAction<ShoppingItem>) {
            const index = state.shoppingItems.indexOf(action.payload);
            if (index >= 0) {
                state.shoppingItems.splice(index, 1);
            }

            saveToLocalStorage(state);
        },
        updateShoppingCartItemQuantity(state: ShoppingCartState, action: PayloadAction<QuantityUpdate>) {
            state.shoppingItems[action.payload.itemIndex].quantity = action.payload.newQuantity;

            saveToLocalStorage(state);
        },
    },
});

export const {
    addItemToShoppingCart,
    loadShoppingCartFromLocalStorage,
    removeAllFromShoppingCart,
    removeItemFromShoppingCart,
    updateShoppingCartItemQuantity,
} = slice.actions;
export default slice.reducer;

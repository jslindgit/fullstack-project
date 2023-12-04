import { AnyAction, createSlice, current, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { ShoppingItem } from '../types/orderTypes';
import { NewOrder, Order } from '../types/orderTypes';

import { getEmptyOrder, isOrderOrNewOrder } from '../types/orderTypeFunctions';

interface QuantityUpdate {
    itemIndex: number;
    newQuantity: number;
}

export type OrderState = NewOrder | Order;

const slice = createSlice({
    name: 'order',
    initialState: getEmptyOrder(),
    reducers: {
        addItemToShoppingCart(state: OrderState, action: PayloadAction<ShoppingItem>) {
            const existingItem = current(state).items.find((si) => si.id === action.payload.id);
            if (existingItem) {
                const updatedShoppingItems = current(state).items.filter((item) => item !== existingItem);
                updatedShoppingItems.push({ ...existingItem, quantity: existingItem.quantity + action.payload.quantity });
                state.items = updatedShoppingItems;
            } else {
                state.items.push(action.payload);
            }
        },
        removeAllFromShoppingCart(state: OrderState, _action: PayloadAction) {
            state.items = [];
        },
        removeItemFromShoppingCart(state: OrderState, action: PayloadAction<ShoppingItem>) {
            const updatedShoppingItems = current(state).items.filter((item) => item !== action.payload);
            state.items = updatedShoppingItems;
        },
        setShoppingCart(state: OrderState, action: PayloadAction<ShoppingItem[]>) {
            state.items = action.payload;
        },
        updateShoppingCartItemQuantity(state: OrderState, action: PayloadAction<QuantityUpdate>) {
            state.items[action.payload.itemIndex].quantity = action.payload.newQuantity;
        },
        setOrder(_state: OrderState, action: PayloadAction<NewOrder | Order>) {
            return action.payload;
        },
    },
});

export const initializeOrder = (dispatch: Dispatch<AnyAction>) => {
    const storedOrderString = localStorage.getItem('order');

    const order = storedOrderString ? JSON.parse(storedOrderString) : getEmptyOrder();

    if (isOrderOrNewOrder(order)) {
        setOrder(getEmptyOrder());
    }

    dispatch(slice.actions.setOrder(order));
};

export const saveOrderToLocalStorage = (state: OrderState) => {
    localStorage.setItem('order', JSON.stringify(state));
};

export const { addItemToShoppingCart, removeAllFromShoppingCart, removeItemFromShoppingCart, setOrder, updateShoppingCartItemQuantity } = slice.actions;
export default slice.reducer;

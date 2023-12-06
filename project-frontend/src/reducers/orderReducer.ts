import { AnyAction, createSlice, current, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { ShoppingItem } from '../types/orderTypes';
import { NewOrder, Order } from '../types/orderTypes';

import { getEmptyOrder, isOrderOrNewOrder, isShoppingItem } from '../types/orderTypeFunctions';

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
        setOrder(_state: OrderState, action: PayloadAction<NewOrder | Order>) {
            //console.log('setting orderRecuder.state to:', action.payload);
            return action.payload;
        },
        setShoppingCart(state: OrderState, action: PayloadAction<ShoppingItem[]>) {
            state.items = action.payload;
        },
        updateShoppingCartItemQuantity(state: OrderState, action: PayloadAction<QuantityUpdate>) {
            state.items[action.payload.itemIndex].quantity = action.payload.newQuantity;
        },
    },
});

export const initializeOrder = (dispatch: Dispatch<AnyAction>) => {
    const storedOrderString = localStorage.getItem('order');

    let order = storedOrderString ? JSON.parse(storedOrderString) : getEmptyOrder();

    if (isOrderOrNewOrder(order)) {
        // Ensure that the ShoppingItems in order.items (shopping cart) are valid:
        const validShoppingItems: ShoppingItem[] = [];
        order.items.forEach((shoppingItem) => {
            if (isShoppingItem(shoppingItem)) {
                validShoppingItems.push(shoppingItem);
            } else {
                console.warn('Invalid ShoppingItem in shopping cart - removing:', shoppingItem);
            }
        });
        order.items = validShoppingItems;
    } else {
        order = getEmptyOrder();
    }

    dispatch(slice.actions.setOrder(order));
};

export const clearOrder = (dispatch: Dispatch<AnyAction>) => {
    dispatch(slice.actions.setOrder(getEmptyOrder()));
};

export const saveOrderToLocalStorage = (state: OrderState) => {
    localStorage.setItem('order', JSON.stringify(state));
};

export const { addItemToShoppingCart, removeAllFromShoppingCart, removeItemFromShoppingCart, setOrder, updateShoppingCartItemQuantity } = slice.actions;
export default slice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Category } from '../types/types';

export type CategoryState = Category[];

const slice = createSlice({
    name: 'categories',
    initialState: [] as CategoryState,
    reducers: {
        addCategory(state: CategoryState, action: PayloadAction<Category>) {
            state.push(action.payload);
        },
        setCategories(_state: CategoryState, action: PayloadAction<Category[]>) {
            return action.payload;
        },
    },
});

export const { addCategory, setCategories } = slice.actions;
export default slice.reducer;

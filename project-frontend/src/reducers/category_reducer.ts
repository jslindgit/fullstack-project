import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Category } from '../types/types';

export type CategoryState = Category[];

const slice = createSlice({
    name: 'categories',
    initialState: [] as CategoryState,
    reducers: {
        setCategories(_state: CategoryState, action: PayloadAction<Category[]>) {
            return action.payload;
        },
    },
});

export const { setCategories } = slice.actions;
export default slice.reducer;

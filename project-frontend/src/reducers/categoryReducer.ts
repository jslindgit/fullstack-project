import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';

import { Category } from '../types/types';
export type CategoryState = Category[];

import categoryService from '../services/categoryService';

const slice = createSlice({
    name: 'categories',
    initialState: [] as CategoryState,
    reducers: {
        addCategory(state: CategoryState, action: PayloadAction<Category>) {
            state.push(action.payload);
        },
        removeCategory(state: CategoryState, action: PayloadAction<Category>) {
            const index = state.indexOf(action.payload);
            state.splice(index - 1);
            return state;
        },
        setCategories(_state: CategoryState, action: PayloadAction<Category[]>) {
            return action.payload;
        },
    },
});

export const initializeCategories = async (dispatch: Dispatch<AnyAction>) => {
    const categories = await categoryService.getAll();
    if (categories) {
        dispatch(setCategories(categories));
    }
};

export const { addCategory, removeCategory, setCategories } = slice.actions;
export default slice.reducer;

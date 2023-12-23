import { Dispatch } from 'react';
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Category } from '../types/types';

export type CategoryState = {
    categories: Category[];
    initialized: boolean;
};

const initialState: CategoryState = {
    categories: [],
    initialized: false,
};

import categoryService from '../services/categoryService';

const slice = createSlice({
    name: 'categories',
    initialState: initialState,
    reducers: {
        addCategory(state: CategoryState, action: PayloadAction<Category>) {
            state.categories.push(action.payload);
        },
        removeCategory(state: CategoryState, action: PayloadAction<Category>) {
            const index = state.categories.indexOf(action.payload);
            state.categories.splice(index - 1);
            return state;
        },
        setCategories(state: CategoryState, action: PayloadAction<Category[]>) {
            state.categories = action.payload;
        },
        setInitialized(state: CategoryState, action: PayloadAction<boolean>) {
            state.initialized = action.payload;
        },
    },
});

export const initializeCategories = async (dispatch: Dispatch<AnyAction>) => {
    const categories = await categoryService.getAll();
    dispatch(slice.actions.setCategories(categories));
    dispatch(slice.actions.setInitialized(true));
};

export const { addCategory, removeCategory } = slice.actions;
export default slice.reducer;

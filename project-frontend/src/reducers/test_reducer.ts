import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TestState {
    viirit: number;
    liput: number;
}

const initialState: TestState = {
    viirit: 0,
    liput: 0,
};

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        addViiri(state: TestState, action: PayloadAction<number>) {
            state.viirit += action.payload;
        },
        addLippu(state: TestState, action: PayloadAction<number>) {
            state.liput += action.payload;
        },
        setState(_state: TestState, action: PayloadAction<TestState>) {
            return action.payload;
        },
    },
});

//console.log(JSON.parse(JSON.stringify(state)))

export const { addLippu, addViiri, setState } = testSlice.actions;
export default testSlice.reducer;

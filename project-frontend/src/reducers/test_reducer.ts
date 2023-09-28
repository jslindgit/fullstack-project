export interface CounterState {
    viirit: number;
    liput: number;
}

export type CounterAction = { type: 'VIIRI' } | { type: 'LIPPU' };

const initialState: CounterState = {
    viirit: 0,
    liput: 0,
};

export const addViiri = (): CounterAction => {
    return {
        type: 'VIIRI',
    };
};

export const addLippu = (): CounterAction => {
    return {
        type: 'LIPPU',
    };
};

/*eslint indent: [2, 4, {"SwitchCase": 1}]*/
const testReducer = (state: CounterState = initialState, action: CounterAction) => {
    switch (action.type) {
        case 'VIIRI':
            return { ...state, viirit: state.viirit + 1 };
        case 'LIPPU':
            return { ...state, liput: state.liput + 1 };
        default:
            return state;
    }
};

export default testReducer;

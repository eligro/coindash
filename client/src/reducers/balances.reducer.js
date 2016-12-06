import * as types from '../actions/action.const';

export default function balancesReducer(state = [], action) {
    switch(action.type) {
        case types.LOAD_BALANCES_SUCCESS:
            return [...action.data];

        default:
            return state;
    }
}
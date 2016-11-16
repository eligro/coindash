import * as types from '../actions/action.const';

export default function exchangeReducer(state = [], action) {
    switch(action.type) {
        case types.CREATE_EXCHANGE:
            return [...state, Object.assign({}, action.exchange)];

        case types.DELETE_EXCHANGE:
            return state.filter((exchange, index) => index !== action.index);

        default:
            return state;
    }
}
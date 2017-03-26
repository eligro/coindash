import * as types from '../actions/action.const';

export default function copyCryptoReducer(state = {}, action) {
    switch(action.type) {
        case types.GET_INVITE_SUCCESS:
        	console.log("Success: " + action.data);
            return Object.assign({}, state, {
                userData: action.data
            });

        default:
            return state;
    }
}
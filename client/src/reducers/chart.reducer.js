import * as types from '../actions/action.const';

export default function chartReducer(state = {}, action) {
    switch(action.type) {
        case types.LOAD_CHART_SUCCESS:
            return Object.assign({}, state, {
                chartData: action.data
            });
        
        case types.LOAD_CHART_RISK_SUCCESS:
            return Object.assign({}, state, {
                chartData: action.data
            });

        default:
            return state;
    }
}
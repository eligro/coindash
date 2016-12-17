import * as types from '../actions/action.const';
import Utils from '../utils/Utils';

export default function chartReducer(state = {}, action) {
    switch(action.type) {
        case types.LOAD_CHART_SUCCESS:
            console.log(types.LOAD_CHART_SUCCESS, action);

            const portfolioData = action.data.map(i => [i.timestamp * 1000, i.dayFiatValue]);
            const btcData = action.data.map(i => [i.timestamp * 1000, i.dayFiatValue + Utils.rnd(-1, 1)]);

            console.log(types.LOAD_CHART_SUCCESS, Object.assign({}, state, {
                chartData: {btcData, portfolioData}
            }));

            return Object.assign({}, state, {
                chartData: {btcData, portfolioData}
            });
        
        case types.LOAD_CHART_RISK_SUCCESS:
            return Object.assign({}, state, {
                chartData: action.data
            });

        default:
            return state;
    }
}
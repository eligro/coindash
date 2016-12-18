import * as types from '../actions/action.const';
import Utils from '../utils/Utils';

export default function chartReducer(state = {}, action) {
    switch(action.type) {
        case types.LOAD_CHART_SUCCESS:
            console.log(types.LOAD_CHART_SUCCESS, action);

            const portfolioData = action.data.portfolio.map(i => [i.timestamp * 1000, i.delta]);
            const btcData = action.data.market.map(i => [i.timestamp * 1000, i.delta]);

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
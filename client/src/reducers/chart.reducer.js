import * as types from '../actions/action.const';
// import Utils from '../utils/Utils';

export default function chartReducer(state = {}, action) {
    switch(action.type) {
        case types.LOAD_CHART_SUCCESS:
            console.log("LOAD_CHART_SUCCESS");
            console.log(action.data);

            // benchmark chart
            const portfolioAggDelta = action.data.portfolio.map(i => [i.timestamp * 1000, i.aggregatedDelta ]);
            const btcAggDelta = action.data.market.map(i => [i.timestamp * 1000, i.aggregatedDelta]);

            // preformance chart
            const portfolioPerfo = action.data.portfolio.map(i => [i.timestamp * 1000, i.dayFiatValue ]);

            return Object.assign({}, state, {
                chartData: {btcAggDelta, portfolioAggDelta},
                preformanceData: portfolioPerfo
            });
        
        case types.LOAD_CHART_RISK_SUCCESS:
            return Object.assign({}, state, {
                chartData: action.data
            });

        case types.CLEAR_CHARTS:
            return {chartData: null, preformanceData: null, statusText: "", chartLoaded: Boolean(false)};

        case types.SET_CHART_LOADED:
            return Object.assign({}, state, {
                chartLoaded: Boolean(action.state)
            });

        case types.SET_STATUS_TEXT:
            return Object.assign({}, state, {
                statusText: action.text
            });

        default:
            return state;
    }
}
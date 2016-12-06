import * as types from './action.const';
import ChartAPI from '../api/mockChartsApi';

export function loadChartSuccess(data) {
    return {type: types.LOAD_CHART_SUCCESS, data};
}

export function loadChartRiskSuccess(data) {
    return {type: types.LOAD_CHART_RISK_SUCCESS, data};
}

export function loadChart() {
    return (dispatch) => {
        return ChartAPI.getChart().then(data => {
            dispatch(loadChartSuccess(data));
        }).catch(error => {
            throw(error);
        })
    }
}

export function loadChartRisk() {
    return (dispatch) => {
        return ChartAPI.getRiskChart().then(data => {
            dispatch(loadChartRiskSuccess(data));
        }).catch(error => {
            throw(error);
        })
    }
}
import * as types from './action.const';
import ChartAPI from '../api/mockChartsApi';

import {AccountsManager} from '../utils/Accounts/AccountsManager';

export function loadChartSuccess(data) {
    return {type: types.LOAD_CHART_SUCCESS, data};
}

export function loadChartRiskSuccess(data) {
    return {type: types.LOAD_CHART_RISK_SUCCESS, data};
}

export function loadChart() {
    return (dispatch) => {
        let manager = AccountsManager.hardcodedManager();
        let day = 24 * 60 * 60;
        let today = Math.floor(Date.now() / 1000);

        manager.dayStatusFromDate(today - 10 * day, function (data) {
            dispatch(loadChartSuccess(data));
            // print
            /*
             for(let i in data) {
             let day = data[i];
             let usdValue = day.dayFiatValue;
             let depoValue = day.depositsFiatValue;
             let withValue = day.withdrawalsFiatValue;
             let delta = day.delta;

             let date = new Date(day.timestamp*1000);
             let str = date.toISOString() + "\n";
             str += "day $" + usdValue + "\n";
             str += "deposits $" + depoValue + "\n";
             str += "withdrawals $" + withValue + "\n";
             str += "delta %" + delta + "\n";

             for(let x in day.balances) {
             let t = day.balances[x];
             str += t.symbol + " " + t.prettyBalance() + "\n";
             }

             console.log('wot', str);
             }
             */
        });
    }
}

/*export function loadChart() {
    return (dispatch) => {
        return ChartAPI.getChart().then(data => {
            dispatch(loadChartSuccess(data));
        }).catch(error => {
            throw(error);
        })
    }
}*/

export function loadChartRisk() {
    return (dispatch) => {
        return ChartAPI.getRiskChart().then(data => {
            dispatch(loadChartRiskSuccess(data));
        }).catch(error => {
            throw(error);
        })
    }
}
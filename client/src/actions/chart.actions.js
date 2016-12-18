import * as types from './action.const';
import ChartAPI from '../api/mockChartsApi';
import {ETHWallet} from '../utils/Accounts/Ethereum/ETHWallet';
import {PoloniexAccount} from '../utils/Accounts/Poloniex/PoloniexAccount';

import {AccountsManager} from '../utils/Accounts/AccountsManager';
import {Token} from '../utils/Trades/Token';
import {ExchangeProvider} from '../utils/ExchangeProvider/ExchangeProvider';

export function loadChartSuccess(data) {
    return {type: types.LOAD_CHART_SUCCESS, data};
}

export function loadChartRiskSuccess(data) {
    return {type: types.LOAD_CHART_RISK_SUCCESS, data};
}

export function loadChart() {
    return (dispatch, getState) => {
        let ethTokens = getState().exchanges.filter(i => i.type === 'ethereum').map(i => i.token);
        var accounts = [];

        if (ethTokens.length) {
            let wallet = new ETHWallet(ethTokens);
            accounts = wallet.getAccounts();
        }

        getState().exchanges.filter(i => i.type === 'polonix').forEach(i => {
            console.log(i);
            let poloniexAccount = new PoloniexAccount(i.token, i.secret);
            accounts.push(poloniexAccount);
        })

        if (accounts.length) {
            let manager = new AccountsManager(accounts);
            let day = 24 * 60 * 60;
            let today = Math.floor(Date.now() / 1000);

            let spanTime = today - 10 * day;

            manager.dayStatusFromDate(spanTime, function (data) {
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


            let provider = ExchangeProvider.coinMarketCapProvider();
            provider.getTokenDayStatus(Token.BTC(), "usd", spanTime, function(data) {
                console.log(data);
            });
        }

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
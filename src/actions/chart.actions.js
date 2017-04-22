import * as types from './action.const'
import ChartAPI from '../api/mockChartsApi'
import {ETHWallet} from '../utils/Accounts/Ethereum/ETHWallet'
import {PoloniexAccount} from '../utils/Accounts/Poloniex/PoloniexAccount'

import {AccountsManager} from '../utils/Accounts/AccountsManager'

export function loadChartSuccess (data) {
  return {type: types.LOAD_CHART_SUCCESS, data}
}

export function loadChartRiskSuccess (data) {
  return {type: types.LOAD_CHART_RISK_SUCCESS, data}
}

export function loadedChartWithState (state) {
  return {type: types.SET_CHART_LOADED, state}
}

export function setLoadedChart (state) {
  return (dispatch, getState) => {
    dispatch(loadedChartWithState(state))
  }
}

export function chartText (text) {
  return {type: types.SET_STATUS_TEXT, text}
}

export function chartError (text) {
  return {type: types.CHART_ERROR, text}
}

export function loadChart () {
  return (dispatch, getState) => {
    if (getState().charts.chartLoaded === true) {
      console.log('chart already loaded, do not load again')
      dispatch(chartText(''))
      return
    }

    dispatch(chartText('Fetching data ...'))
    console.log('started chart loading')

    let ethTokens = getState().exchanges.filter(i => i.type === 'ethereum').map(i => i.token)
    var accounts = []

    if (ethTokens.length) {
      let wallet = new ETHWallet(ethTokens)
      accounts = wallet.getAccounts()
    }

    getState().exchanges.filter(i => i.type === 'polonix').forEach(i => {
      let poloniexAccount = new PoloniexAccount(i.token, i.secret)
      accounts.push(poloniexAccount)
    })

    if (accounts.length) {
      let manager = new AccountsManager(accounts)
      let day = 24 * 60 * 60
      let today = Math.floor(Date.now() / 1000)

      let spanTime = today - 90 * day

      manager.dayStatusFromDate(spanTime,
                function (obj) { // status updater
                  if (obj.error != null) {
                    console.error(obj.error)
                    dispatch(chartText(obj.error))
                  } else {
                    dispatch(chartText(obj.progress * 100 + '%'))
                  }
                },
                function (data) {
                  if (data == null) {
                    dispatch(chartError('No Balance Found'))
                  }
                // Calc 7 days delta
                  manager.calcDeltaByDays(data, 7,
                    function (shortDelta) {
                      data.shortDelta = shortDelta
                    })
                // Calc 365 days delta
                  manager.calcDeltaByDays(data, 365,
                    function (longDelta) {
                      data.longDelta = longDelta
                    })

                  console.log('finished loading charts')
                  dispatch(loadedChartWithState(true))
                  dispatch(loadChartSuccess(data))

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

                 }
                 */
                })
    } else { // no account
      console.log('No accounts found, not loading charts')
      dispatch(chartText(''))
    }
  }
}

/* export function loadChart() {
    return (dispatch) => {
        return ChartAPI.getChart().then(data => {
            dispatch(loadChartSuccess(data));
        }).catch(error => {
            throw(error);
        })
    }
} */

export function clearCharts () {
  return {type: types.CLEAR_CHARTS}
}

export function loadChartRisk () {
  return (dispatch) => {
    return ChartAPI.getRiskChart().then(data => {
      dispatch(loadChartRiskSuccess(data))
    }).catch(error => {
      throw (error)
    })
  }
}

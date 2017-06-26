import * as types from './action.const'
import ChartAPI from '../api/mockChartsApi'
import { ETHWallet } from '../utils/Accounts/Ethereum/ETHWallet'
import * as Portman from 'osi/components/portman'
import * as portfolioActions from './portfolio.actions'


import { AccountsManager } from '../utils/Accounts/AccountsManager'

export function loadChartSuccess (data) {
  return { type: types.LOAD_CHART_SUCCESS, data }
}

export function loadChartRiskSuccess (data) {
  return { type: types.LOAD_CHART_RISK_SUCCESS, data }
}

export function loadedChartWithState (state) {
  return { type: types.SET_CHART_LOADED, state }
}

export function setLoadedChart (state) {
  return (dispatch, getState) => {
    dispatch(loadedChartWithState(state))
  }
}

export function chartText (text) {
  return { type: types.SET_STATUS_TEXT, text }
}

export function balanceError (text) {
  return { type: types.BALANCE_ERROR, text }
}

export function chartError (text) {
  return { type: types.CHART_ERROR, text }
}

export function beginCalculations (pid) {
  return { type: types.PORTFOLIO_CALCULATION_BEGIN, pid }
}

export function finishCalculations ({pid, data}) {
  return { type: types.PORTFOLIO_CALCULATION_FINISH, pid, data }
}

export function calcError ({pid, error}) {
  return { type: types.PORTFOLIO_CALCULATION_ERROR, pid, error }
}

export function calcUpdateProcess ({pid, progress}) {
  return { type: types.PORTFOLIO_CALCULATION_UPDATE, pid, progress }
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

    let ethTokens = getState().exchanges
      .filter(i => i.type === 'ethereum')
      .map(i => i.token)
    var accounts = []

    if (ethTokens.length) {
      let wallet = new ETHWallet(ethTokens)
      accounts = wallet.getAccounts()
    }

    if (accounts.length) {
      let manager = new AccountsManager(accounts)
      let day = 24 * 60 * 60
      let today = Math.floor(Date.now() / 1000)

      let spanTime = today - 90 * day

      manager.dayStatusFromDate(
        spanTime,
        function (obj) {
          // status updater
          if (obj.error != null) {
            console.error(obj)
            dispatch(chartError(obj.error))
          } else {
            let progress = obj.progress * 100
            progress = Math.round(progress * 100) / 100
            dispatch(chartText(progress))
          }
        },
        function (data) {
          if (data == null) {
            dispatch(balanceError('No Balance Found'))
          }
          // Calc 7 days delta
          manager.calcDeltaByDays(data, 7, function (shortDelta) {
            data.shortDelta = shortDelta
          })
          // Calc 365 days delta
          manager.calcDeltaByDays(data, 365, function (longDelta) {
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
        }
      )
    } else {
      // no account
      console.log('No accounts found, not loading charts')
      dispatch(chartText(''))
    }
  }
}

export function calcPortfolio (pid, addressList) {
  return (dispatch, getState) => {
    dispatch(beginCalculations(pid))
    let ethAddresses = addressList.map(e => e.address)
    let accounts = []

    if (ethAddresses.length) {
      let wallet = new ETHWallet(ethAddresses)
      accounts = wallet.getAccounts()
    }

    if (accounts.length) {
      let manager = new AccountsManager(accounts)
      let day = 24 * 60 * 60
      let today = Math.floor(Date.now() / 1000)

      let spanTime = today - 90 * day

      manager.dayStatusFromDate(
        spanTime,
        function (obj) {
          // status updater
          if (obj.error != null) {
            console.error(obj)
            dispatch(calcError({pid, error: obj}))
          } else {
            let progress = obj.progress * 100
            progress = Math.round(progress * 100) / 100
            dispatch(calcUpdateProcess({pid, progress}))
          }
        },
        function (data) {
          if (data == null) {
            dispatch(calcError({pid, error: 'No balances found'}))
          }
          // Calc 7 days delta
          manager.calcDeltaByDays(data, 7, function (shortDelta) {
            data.shortDelta = shortDelta
          })
          // Calc 365 days delta
          manager.calcDeltaByDays(data, 365, function (longDelta) {
            data.longDelta = longDelta
          })

          console.log('finished loading charts')
          // dispatch(loadedChartWithState(true))

          console.log('data is ready for firebase:', data)
          // store the data in firebase
          Portman.updatePortfolioCalculations(pid, data)
            .then(_ => {
              dispatch(finishCalculations({pid, data}))
              dispatch(portfolioActions.loadPortfolioCalculations(pid))
            })

          // dispatch(loadChartSuccess(data))
        }
      )
    } else {
      // no account
      console.log('No accounts found, not loading charts')
      dispatch(chartText(''))
    }
  }
}

export function clearCharts () {
  return { type: types.CLEAR_CHARTS }
}

export function loadChartRisk () {
  return dispatch => {
    return ChartAPI.getRiskChart()
      .then(data => {
        dispatch(loadChartRiskSuccess(data))
      })
      .catch(error => {
        throw error
      })
  }
}

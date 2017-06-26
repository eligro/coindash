import * as types from './action.const'
// import BalancesAPI from '../api/mockBalancesApi';
import {ETHWallet} from '../utils/Accounts/Ethereum/ETHWallet'
import {PoloniexAccount} from '../utils/Accounts/Poloniex/PoloniexAccount'
import {AccountsManager} from '../utils/Accounts/AccountsManager'
import * as Portman from 'osi/components/portman'

export function loadBalancesSuccess (data) {
  return {type: types.LOAD_BALANCES_SUCCESS, data}
}

export function loadBalancesError (data) {
  return {type: types.LOAD_BALANCES_ERROR, data}
}

export function calcBalancesStart (pid) {
  return {type: types.CALC_BALANCES_SUCCESS, pid}
}
export function calcBalancesSuccess ({pid, data}) {
  return {type: types.CALC_BALANCES_SUCCESS, data, pid}
}
export function calcBalancesAdd ({pid, data}) {
  return {type: types.CALC_BALANCES_ADD, data, pid}
}
export function calcBalancesError ({pid, error}) {
  return {type: types.CALC_BALANCES_ERROR, pid, error}
}
export function calcBalancesFetch (pid) {
  return {type: types.CALC_BALANCES_FETCH, pid}
}
export function fetchBalancesNoResult (pid) {
  return {type: types.CALC_BALANCES_FETCH_NO_RESULT, pid}
}

export function loadBalances () {
  return (dispatch, getState) => {
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
      manager.getBalances(function (data) {
        dispatch(loadBalancesSuccess(data))
      })
    }
  }
}

export function calcBalances (pid, addressList) {
  return (dispatch, getState) => {
    let ethAddresses = addressList.map(e => e.address)
    let accounts = []

    if (ethAddresses.length) {
      let wallet = new ETHWallet(ethAddresses)
      accounts = wallet.getAccounts()
    }

    getState().exchanges.filter(i => i.type === 'polonix').forEach(i => {
      let poloniexAccount = new PoloniexAccount(i.token, i.secret)
      accounts.push(poloniexAccount)
    })

    dispatch(calcBalancesFetch(pid))

    if (accounts.length) {
      let manager = new AccountsManager(accounts)
      manager.getBalances(function (data) {
        Portman.updatePortfolioBalances(pid, data)
          .then(updatedData => {
            dispatch(calcBalancesSuccess({pid, data: updatedData}))
          })
      })
    }
  }
}

export function fetchBalances (pid) {
  return dispatch => {
    dispatch(calcBalancesFetch(pid))
    return Portman.getPFIDByPID(pid)
    .then(pfid => Portman.getPortfolioBalances(pfid))
    .then(data => {
      dispatch(data && data.data && data.data.length ? calcBalancesAdd({pid, data}) : fetchBalancesNoResult(pid))
    })
  }
}
export function clearBalances () {
  return {type: types.DELETE_EXCHANGE}
}

import * as types from './action.const'
import * as Portman from 'osi/components/portman'

export function createPortfolio (data) {
  return {type: types.CREATE_PORTFOLIO, data}
}
export function addPortfolio (portfolio) {
  return {type: types.ADD_PORTFOLIO, portfolio}
}

export function clearPortfolios () {
  return {type: types.CLEAR_PORTFOLIOS}
}

export function addUserPortfolio (portfolio) {
  return {type: types.ADD_USER_PORTFOLIO, portfolio}
}

export function addUserPortfolios (portfolios) {
  return {type: types.ADD_USER_PORTFOLIOS, portfolios}
}

export function addAddressToPortfolio (data) {
  return {type: types.ADD_ADDRESS_TO_PORTFOLIO, data}
}

export function addTokenToPortfolio (pid, data) {
  return {type: types.ADD_TOKEN_TO_PORTFOLIO, pid, data}
}

export function addPortfolioCalculations ({pid, data}) {
  return {type: types.LOAD_PORTFOLIO_CALCULATIONS, pid, data}
}

export function beginFetchingPortfolio (pid) {
  return {type: types.BEGIN_FETCHING_PORTFOLIO, pid}
}

export function noUserPortfolios () {
  return {type: types.NO_USER_PORTFOLIOS_FOUND}
}

export function beginUserPortfolios (uid) {
  return {type: types.BEGIN_USER_PORTFOLIOS_FETCHING, uid}
}

export function setActivePortfolio (pid) {
  return {type: types.SET_ACTIVE_PORTFOLIO, pid}
}

export function deletePortfolio (uid) {
  return {type: types.DELETE_PORTFOLIO, uid}
}

export function deletePortfolioSuccess (pid) {
  return {type: types.DELETE_PORTFOLIO_SUCCESS, pid}
}

export function deleteAddressFromPortfolio (uid) {
  return {type: types.DELETE_ADDRESS_PORTFOLIO, uid}
}

export function deleteAddressPortfolioSuccess (pf, address, userKey) {
  return {type: types.DELETE_ADDRESS_PORTFOLIO_SUCCESS, pf, address, userKey}
}

export function deleteTokenFromPortfolio (pf, data) {
  return {type: types.DELETE_TOKEN_FROM_PORTFOLIO, pid: pf.portfolio.pid, data}
}




export function newPortfolio (portfolio) {
  return dispatch => {
    let newPortfolio = {
      name: portfolio.name,
      uid: portfolio.uid,
      description: portfolio.description
    }

    return Portman.createPortfolio(newPortfolio)
      .then(res => {
        dispatch(addPortfolio(res))
        return res
        // dispatch(createPortfolio(portfolio))
      })
  }
}

export function loadUserPortfolios (uid) {
  return dispatch => {
    dispatch(beginUserPortfolios(uid))
    return Portman.getUserPortfolios(uid)
    .then(userPortfolios => {
      userPortfolios.length ? dispatch(addUserPortfolios(userPortfolios)) : dispatch(noUserPortfolios())
    })
  }
}

export function resetPortfolios () {
  return dispatch => {
    return dispatch(clearPortfolios())
  }
}

export function removePortfolio (pf) {
  return dispatch => {
    dispatch(deletePortfolio(pf.portfolio.pid))
    return Portman.deletePortfolio(pf)
      .then(_ => dispatch(deletePortfolioSuccess(pf.portfolio.pid)))
  }
}

export function associateAddressToPortfolio (pid, address) {
  return dispatch => Portman.associateAddressWithPortfolio(pid, address)
    .then(result => dispatch(addAddressToPortfolio({pid, address})))
}
export function associateTokenToPortfolio (pid, token) {
  return dispatch => Portman.associateTokenWithPortfolio(pid, token)
    .then(result => {
      dispatch(addTokenToPortfolio({pid, token}))
      return result
    })
}

export const loadPortfolioCalculations = (pid) => {
  return dispatch => {
    dispatch(beginFetchingPortfolio(pid))
    return Portman.getPortfolioCalculations(pid)
      .then(result => dispatch(addPortfolioCalculations({
        pid: pid,
        data: result
      })))
  }
}

export function makePortfolioActive (pid) {
  return dispatch => dispatch(setActivePortfolio(pid))
}

export function removeAddressFromPortfolio (pf, address, userKey) {
  return dispatch => {
    return Portman.deletePortfolioAddress(pf, address, userKey)
      .then(_ => dispatch(deleteAddressFromPortfolio(pf, address, userKey)))
  }
}

export function removeCustomToken (pf, token) {
  return dispatch => {
    return Portman.deleteCustomToken(pf, token)
      .then(_ => dispatch(deleteTokenFromPortfolio(pf, token)))
  }
}

import * as types from './action.const'
import Auth from 'osi/auth'
import User from 'osi/user'
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

export function addPortfolioCalculations ({pid, data}) {
  console.log('portfolio calculations brought:', pid, data)
  return {type: types.LOAD_PORTFOLIO_CALCULATIONS, pid, data}
}

export function beginFetchingPortfolio (pid) {
  return {type: types.BEGIN_FETCHING_PORTFOLIO, pid}
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
  return dispatch => Portman.getUserPortfolios(uid)
    .then(userPortfolios => dispatch(addUserPortfolios(userPortfolios)))
}

export function resetPortfolios () {
  return dispatch => {
    return dispatch(clearPortfolios())
  }
}

export function associateAddressToPortfolio (pid, address) {
  return dispatch => Portman.associateAddressWithPortfolio(pid, address)
    .then(result => dispatch(addAddressToPortfolio({pid, address})))
}

export const loadPortfolioCalculations = (portfolio) => {
  return dispatch => {
    dispatch(beginFetchingPortfolio(portfolio.portfolio.pid))
    return Portman.getPortfolioCalculations(portfolio.pfid)
      .then(result => dispatch(addPortfolioCalculations({
        pid: portfolio.portfolio.pid,
        data: result
      })))
  }
}

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

export function newPortfolio (portfolio) {
  return dispatch => {
    let newPortfolio = {
      name: portfolio.name,
      uid: portfolio.uid,
      description: portfolio.description
    }

    return Portman.createPortfolio(newPortfolio)
      .then(res => {
        console.log('result of createPortfolio:', res)
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

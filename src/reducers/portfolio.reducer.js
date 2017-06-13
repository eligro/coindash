import * as types from '../actions/action.const'
import { REHYDRATE } from 'redux-persist/constants'

const baseState = {
  portfolios: [],
  userPortfolios: []
}

export default function portfolioReducer (state = {}, action) {
  let portfolios
  switch (action.type) {
    case types.CREATE_PORTFOLIO:
      return Object.assign({}, state, {
        portfolio: action.data
      })
    case types.ADD_PORTFOLIO:
      return Object.assign({}, state, {
        portfolios: [
          ...state.portfolios,
          action.portfolio
        ]
      })
    case types.ADD_USER_PORTFOLIO:
      portfolios = state.userPortfolios.filter(p => p.pfid !== action.portfolio.pfid)
      return Object.assign({}, state, {
        userPortfolios: [
          ...portfolios,
          action.portfolio
        ]
      })
    case types.ADD_USER_PORTFOLIOS:
      const pids = action.portfolios.map(pf => pf.portfolio.pid)
      portfolios = state.portfolios.filter(pf => pids.indexOf(pf.portfolio.pid) === -1)

      const userPortfolios = state.userPortfolios.filter(e => pids.indexOf(e) === -1)
      return Object.assign({}, state, {
        userPortfolios: [
          ...userPortfolios,
          ...pids
        ],
        portfolios: [
          ...portfolios,
          ...action.portfolios
        ]
      })
    case REHYDRATE:
    case types.CLEAR_PORTFOLIOS:
      return baseState

    default:
      return state
  }
}

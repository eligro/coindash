import * as types from '../actions/action.const'
import { REHYDRATE } from 'redux-persist/constants'

const baseState = {
  portfolios: [],
  userPortfolios: []
}

export default function portfolioReducer (state = {}, action) {
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
      console.info('add user portfolio:', action, state)
      let portfolios = state.userPortfolios.filter(p => p.pfid !== action.portfolio.pfid)
      return Object.assign({}, state, {
        userPortfolios: [
          ...portfolios,
          action.portfolio
        ]
      })
    case REHYDRATE:
    case types.CLEAR_PORTFOLIOS:
      return baseState

    default:
      return state
  }
}

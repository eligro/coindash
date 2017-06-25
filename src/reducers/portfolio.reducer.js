import * as types from '../actions/action.const'
import { REHYDRATE } from 'redux-persist/constants'

const baseState = {
  portfolios: [],
  userPortfolios: [],
  process: {},
  calculations: {}
}

export default function portfolioReducer (state = baseState, action) {
  let portfolios
  const process = (action.pid && state.process[action.pid]) || {}
  switch (action.type) {
    case types.BEGIN_USER_PORTFOLIOS_FETCHING:
      return Object.assign({}, state, {
        userPortfoliosFetching: true
      })
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
        hasUserPortfolios: true,
        userPortfoliosFetching: false,
        lastUpdate: Date.now(),
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
        hasUserPortfolios: !!([...userPortfolios, ...pids]).length,
        userPortfoliosFetching: false,
        lastUpdate: Date.now(),
        userPortfolios: [
          ...userPortfolios,
          ...pids
        ],
        portfolios: [
          ...portfolios,
          ...action.portfolios
        ]
      })

    case types.LOAD_PORTFOLIO_CALCULATIONS:
      return Object.assign({}, state, {
        process: {
          ...state.process,
          [action.pid]: {
            ...(state.process[action.pid] || {}),
            fetching: false
          }
        },
        calculations: {
          ...state.calculations,
          [action.pid]: action.data
        }
      })

    case types.PORTFOLIO_CALCULATION_BEGIN:
    case types.PORTFOLIO_CALCULATION_FINISH:
    case types.PORTFOLIO_CALCULATION_UPDATE:
    case types.PORTFOLIO_CALCULATION_ERROR:
      const { log = [] } = process
      // console.log('what is stuff?', pid, process, log)
      const logEntry = {
        timestamp: Date.now(),
        type: action.type
      }
      const calculations = {
        ...state.calculations
      }

      let isComplete = false

      if (action.type === types.PORTFOLIO_CALCULATION_ERROR) {
        logEntry.error = action.error
      }
      if (action.type === types.PORTFOLIO_CALCULATION_UPDATE) {
        logEntry.progress = action.progress
      }
      if (action.type === types.PORTFOLIO_CALCULATION_FINISH) {
        logEntry.progress = action.progress
        calculations[action.pid] = action.data
        isComplete = true
      }

      return Object.assign({}, state, {
        calculations,
        process: {
          ...state.process,
          [action.pid]: {
            ...process,
            [isComplete ? 'completed' : 'started']: !isComplete,
            log: [
              ...log,
              logEntry
            ]
          }
        }
      })

    case types.BEGIN_FETCHING_PORTFOLIO:
      return Object.assign({}, state, {
        process: {
          ...state.process,
          [action.pid]: {
            ...(state.process[action.pid] || {}),
            fetching: true
          }
        }
      })
    case types.NO_USER_PORTFOLIOS_FOUND:
      return Object.assign({}, state, {
        hasUserPortfolios: false,
        userPortfoliosFetching: false,
        lastUpdate: Date.now()
      })
    case types.SET_ACTIVE_PORTFOLIO:
      return Object.assign({}, state, {
        activePortfolio: action.pid
      })

    case types.DELETE_PORTFOLIO:
      return Object.assign({}, state, {
        process: {
          ...state.process,
          [action.pid]: {
            ...(state.process[action.pid] || {}),
            deleting: true
          }
        }
      })

    case types.DELETE_PORTFOLIO_SUCCESS:
      let processes = Object.keys(state.process)
        .filter((p, k) => k !== action.pid)
      let pfs = state.portfolios.filter(p => p.portfolio.pid !== action.pid)
      let upfs = state.userPortfolios.filter(pid => pid !== action.pid)

      return Object.assign({}, state, {
        portfolios: [ ...pfs ],
        process: { ...processes },
        userPortfolios: [ ...upfs ]
      })

    case REHYDRATE:
      const { activePortfolio } = state
      return { ...baseState, activePortfolio }

    case types.CLEAR_PORTFOLIOS:
      return { ...baseState }

    default:
      return state
  }
}

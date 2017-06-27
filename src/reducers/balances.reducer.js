import * as types from '../actions/action.const'
import * as persist from 'redux-persist/constants'

const baseState = {
  byPid: {}
}

export default function balancesReducer (state = {...baseState}, {pid, data, error, ...action}) {
  let pState = (pid && state.byPid && state.byPid[pid]) || {}
  switch (action.type) {
    case types.LOAD_BALANCES_SUCCESS:
      return [...action.data]

    case types.CALC_BALANCES_FETCH:
      return Object.assign({}, state, {
        byPid: {
          ...state.byPid,
          [pid]: {
            ...pState,
            fetching: true
          }
        }
      })
    case types.CALC_BALANCES_START:
      return Object.assign({}, state, {
        byPid: {
          ...state.byPid,
          [pid]: {
            ...pState,
            started: true,
            fetching: false
          }
        }
      })
    case types.CALC_BALANCES_SUCCESS:
      return Object.assign({}, state, {
        byPid: {
          ...state.byPid,
          [pid]: {
            ...pState,
            fetching: false,
            completed: true,
            data: data.data.map(e => ({...e})) || [],
            updatedOn: data.updatedOn
          }
        }
      })

    case types.CALC_BALANCES_FETCH_NO_RESULT:
      return Object.assign({}, state, {
        byPid: {
          ...state.byPid,
          [pid]: {
            ...pState,
            fetching: false,
            completed: true,
            data: null,
            updatedOn: Date.now()
          }
        }
      })

    case types.CALC_BALANCES_ADD:
      return Object.assign({}, state, {
        byPid: {
          ...state.byPid,
          [pid]: {
            ...pState,
            fetching: false,
            data: data.data.map(e => ({...e})) || [],
            updatedOn: data.updatedOn
          }
        }
      })
    case types.CALC_BALANCES_ERROR:
      return Object.assign({}, state, {
        byPid: {
          ...state.byPid,
          [pid]: {
            ...pState,
            error
          }
        }
      })

    case persist.REHYDRATE:
    case types.CLEAR_BALANCES:
      return {...baseState}

    default:
      return state
  }
}

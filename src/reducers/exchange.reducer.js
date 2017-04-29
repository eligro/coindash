import * as types from '../actions/action.const'

export default function exchangeReducer (state = [], action) {
  switch (action.type) {
    case types.CREATE_EXCHANGE:
      let processed = false
      return [...state, Object.assign({}, action.exchange, {processed})]

    case types.UPDATE_EXCHANGE:
      return [...state, Object.assign({}, action.exchange, {processed: action.processed})]

    case types.DELETE_EXCHANGE:
      return state.filter((exchange, index) => index !== action.index)

    default:
      return state
  }
}

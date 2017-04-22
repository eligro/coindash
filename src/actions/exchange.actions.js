import * as types from './action.const'

export function createExchange (exchange) {
  return (dispatch) => {
    dispatch({type: types.CREATE_EXCHANGE, exchange})
    dispatch({type: types.CLEAR_BALANCES})
    dispatch({type: types.CLEAR_CHARTS})
  }

    // return {type: types.CREATE_EXCHANGE, exchange};
}

export function deleteExchange (index) {
  return (dispatch) => {
    dispatch({type: types.DELETE_EXCHANGE, index})
    dispatch({type: types.CLEAR_BALANCES})
    dispatch({type: types.CLEAR_CHARTS})
  }

    // return {type: types.DELETE_EXCHANGE, index};
}

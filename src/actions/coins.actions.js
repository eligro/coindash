import * as types from './action.const'
import CoinsAPI from '../api/CoinsApi'

export function loadCoinsFrontSuccess (data) {
  return {type: types.LOAD_COINS_FRONT_SUCCESS, data}
}

export function loadFront () {
  return (dispatch) => {
    return CoinsAPI.getFront().then(res => res.json()).then(data => {
      dispatch(loadCoinsFrontSuccess(data))
    }).catch(error => {
      throw (error)
    })
  }
}

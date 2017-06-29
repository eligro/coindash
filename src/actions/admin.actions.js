import * as types from './action.const'

export function adminOn (data) {
  return {type: types.ADMIN_ON, data}
}
export function adminOff () {
  return {type: types.ADMIN_OFF}
}

export function activateAdmin (data) {
  return dispatch => {
    dispatch(adminOn(data))
    return data
  }
}
export function deactivateAdmin () {
  return dispatch => dispatch(adminOff())
}

import * as types from './action.const'
import Auth from 'osi/auth'
import User from 'osi/user'

export function adminOn (data) {
  return {type: types.ADMIN_ON, data}
}

export function activateAdmin (data) {
  return dispatch => {
    dispatch(adminOn(data))
    return data
  }
}

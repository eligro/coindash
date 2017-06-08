import * as types from '../actions/action.const'

export default function userReducer (state = {}, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loggedIn: !!action.data.uid,
        email: action.data.email,
        error: false,
        profile: action.data
      })

    case types.LOGOUT_SUCCESS:
      return {}

    case types.LOGIN_FAILED:
      return Object.assign({}, state, {
        error: action.error.message
      })

    case types.LOGOUT_FAILED:
      return Object.assign({}, state, {
        error: action.error.message
      })

    case types.CLEAR_ERROR:
      return Object.assign({}, state, {
        error: false
      })

    default:
      return state
  }
}

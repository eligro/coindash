import * as types from '../actions/action.const'

export default function userReducer (state = {}, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loggedIn: true,
        email: action.data.email,
        error: false,
        profile: action.data
      })

    case types.LOGIN_FAILED:
      return Object.assign({}, state, {
        error: action.error.message
      })

    // Logout success handled in rootReducer

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

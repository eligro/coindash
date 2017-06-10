import * as types from '../actions/action.const'

export default function userReducer (state = {}, action) {
  switch (action.type) {
    case types.ADMIN_ON:
      return Object.assign({}, state, {
        active: true,
        gmode: action.data.gmode
      })

    case types.ADMIN_OFF:
      return {}

    default:
      return state
  }
}

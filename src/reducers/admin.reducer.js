import * as types from '../actions/action.const'

export default function userReducer (state = {}, action) {
  switch (action.type) {
    case types.ADMIN_ON:
      console.log('reducer ADMIN ON', action)
      return Object.assign({}, state, {
        active: true
      })

    default:
      return state
  }
}

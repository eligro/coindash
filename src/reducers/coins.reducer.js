import * as types from '../actions/action.const'

export default function coinsReducer (state = {}, action) {
  switch (action.type) {
    case types.LOAD_COINS_FRONT_SUCCESS:
      return Object.assign({}, state, {
        front: action.data
      })

    default:
      return state
  }
}

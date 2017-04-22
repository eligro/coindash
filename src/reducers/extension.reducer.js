import * as types from '../actions/action.const'

export default function extensionReducer (state = {}, action) {
  switch (action.type) {
    case types.GET_EXTENSION_VERSION_SUCCESS:
      return Object.assign({}, action.version)

    default:
      return state
  }
}

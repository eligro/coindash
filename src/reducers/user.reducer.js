import * as types from '../actions/action.const'
import { REHYDRATE } from 'redux-persist/constants'

const initialState = {
  loggedIn: false,
  email: '',
  error: true,
  profile: null,
  properties: {},
}

export default function userReducer (state = initialState, action) {
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

    case types.SET_DARK_THEME:
      return Object.assign({}, state, {
        darkTheme: action.dark
      })

    case types.ACTIVATE_VERSION_NOTIFICATION:
      return Object.assign({}, state, {
        showVersionNotification: true
      })

    case types.DISMISS_VERSION_NOTIFICATION:
      return Object.assign({}, state, {
        showVersionNotification: false,
        properties: {
          ...state.properties,
          lastVersion: action.lastVersion
        }
      })

    case types.ACTIVATE_TOUR:
      return { ...state,
        showTour: true
      }

    case types.DISMISS_TOUR:
      console.log('tour dismissing:', action)
      return { ...state,
        showTour: false,
        properties: {
          ...state.properties,
          lastTourVersion: action.lastTourVersion
        }
      }

    case types.SET_USER_PROPERTIES:
      return { ...state, properties: action.properties, propertiesLastUpdate: Date.now() }

    case REHYDRATE:
      return { ...state, properties: {} }

    default:
      return state
  }
}

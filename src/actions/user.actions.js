import * as types from './action.const'
import firebase from '../utils/database.react.js'

export function loginSuccess (data) {
  return {type: types.LOGIN_SUCCESS, data}
}

export function loginFailed (error) {
  return {type: types.LOGIN_FAILED, error}
}

export function logoutSuccess () {
  return {type: types.LOGOUT_SUCCESS}
}

export function logoutFailed (error) {
  return {type: types.LOGOUT_FAILED, error}
}

export function clearError () {
  return {type: types.CLEAR_ERROR}
}

export function login (email, password) {
  return (dispatch) => {
    return firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        let user = {
          name: data.displayName,
          email: data.email,
          photoUrl: data.photoURL,
          emailVerified: data.emailVerified,
          uid: data.uid,
          provider: data.providerData.map(p => ({...p}))
        }

        dispatch(loginSuccess(user))
        return data
      })
  }
}

export function logout () {
  return (dispatch) => {
    return firebase.auth()
      .signOut()
      .then(() => {
        dispatch(logoutSuccess())
      })
  }
}

export function resetError () {
  return (dispatch) => {
    dispatch(clearError())
  }
}

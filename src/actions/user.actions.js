import * as types from './action.const'
import Auth from 'osi/auth'
import * as User from 'osi/user'

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

export function setDarkTheme (dark) {
  return {type: types.SET_DARK_THEME, dark}
}

export function activateVersionNotification () {
  return {type: types.ACTIVATE_VERSION_NOTIFICATION}
}

export function dismissVersionNotification (lastVersion) {
  return {type: types.DISMISS_VERSION_NOTIFICATION, lastVersion}
}

export function setUserProperties (properties) {
  return {type: types.SET_USER_PROPERTIES, properties}
}


export function loadUser (data) {
  return dispatch => {
    let user = {
      name: data.displayName,
      email: data.email,
      photoUrl: data.photoURL,
      emailVerified: data.emailVerified,
      uid: data.uid,
      refreshToken: data.refreshToken,
      provider: data.providerData.map(p => ({...p}))
    }

    dispatch(loginSuccess(user))
    return user
  }
}

export function login (email, password) {
  return (dispatch) => {
    return Auth
      .signInWithEmailAndPassword(email, password)
      .then(data => loadUser(data)(dispatch))
  }
}

export function loginProvider (provider) {
  return (dispatch) => Auth.signInWithProvider(provider)
      .then(data => {
        const profile = data.user
        const credential = data.credential

        let user = {
          name: profile.displayName,
          email: profile.email,
          photoUrl: profile.photoURL,
          emailVerified: profile.emailVerified,
          uid: profile.uid,
          refreshToken: profile.refreshToken,
          provider: profile.providerData.map(p => ({...p})),
          credential
        }

        dispatch(loginSuccess(user))
        return data
      })
      .catch(err => {
        console.info('WE HAVE ERROR!', err)
      })
}

export function logout () {
  return (dispatch) => {
    return Auth.signOut()
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

export function changeToDark (isDark) {
  return (dispatch) => {
    dispatch(setDarkTheme(isDark))
  }
}

export function showVersionNotification () {
  return (dispatch) => {
    dispatch(activateVersionNotification())
  }
}

export function hideVersionNotification (uid, appVersion) {
  return (dispatch) => {
    return User.setUserProp(uid, 'lastVersion', appVersion)
      .then(_ => dispatch(dismissVersionNotification(appVersion)))
      .then(_ => true)
  }
}

export function updateUserProperties (properties) {
  return (dispatch) => {
    dispatch(setUserProperties(properties))
  }
}

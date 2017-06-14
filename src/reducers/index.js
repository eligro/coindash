import { combineReducers } from 'redux'
import exchanges from './exchange.reducer'
import charts from './chart.reducer'
import balances from './balances.reducer'
import coins from './coins.reducer'
import extension from './extension.reducer'
import copyCrypto from './copyCrypto.reducer'
import user from './user.reducer'
import admin from './admin.reducer'
import portfolio from './portfolio.reducer'
import { LOGOUT_SUCCESS } from '../actions/action.const'

const rootReducer = combineReducers({
  exchanges,
  charts,
  balances,
  coins,
  extension,
  copyCrypto,
  user,
  admin,
  portfolio
})

const appReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) { state = undefined }

  return rootReducer(state, action)
}

export default appReducer

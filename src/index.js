import React from 'react'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import routes from './routes'
import './index.css'
import analytics from './components/analytics'

import '../node_modules/fixed-data-table/dist/fixed-data-table.css'

import {getExtensionVersion} from './actions/extension.actions'

const { localStorage } = window
const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {}

const store = configureStore(persistedState)

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

store.dispatch(getExtensionVersion())

// Register analytics listener
browserHistory.listen(analytics.listener)

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
    document.getElementById('root')
)

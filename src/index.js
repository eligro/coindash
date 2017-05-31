import React, { Component } from 'react'
import { render } from 'react-dom'
import configureStore from './store/configureStore'
import { Provider, connect } from 'react-redux'
import { browserHistory, Router } from 'react-router'
// import routes from './routes'
import routes from 'osi/routes'
import localforage from 'localforage'
import './index.css'
import analytics from './components/analytics'
import { persistStore } from 'redux-persist'

import '../node_modules/fixed-data-table/dist/fixed-data-table.css'
import injectTapEventPlugin from 'react-tap-event-plugin'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

// const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {}

const store = configureStore()

// store.subscribe(() => {
//   localStorage.setItem('reduxState', JSON.stringify(store.getState()))
// })

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'CoinDash'
})

// Register analytics listener
browserHistory.listen(analytics.listener)

class RouterProvider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rehydrated: false
    }
  }

  componentWillMount () {
    persistStore(store, { storage: localforage }, () => {
      this.setState({ rehydrated: true })
    })
  }

  render () {
    return (
      <Router history={browserHistory}>
        {routes}
      </Router>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

const AppProviderWithRedux = connect(mapStateToProps, mapDispatchToProps)(RouterProvider)

render(
  <Provider store={store}>
    <AppProviderWithRedux />
  </Provider>,
    document.getElementById('root')
)

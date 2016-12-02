import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import './index.css';

import {loadChart} from './actions/chart.actions';
import {loadBalances} from './actions/balances.actions';
import {loadFront} from './actions/coins.actions';

//const store = configureStore();
//const store = configureStore(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};

const store = configureStore(persistedState);

store.subscribe(()=>{
    console.log('store', store.getState());
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})


store.dispatch(loadChart());
store.dispatch(loadBalances());
store.dispatch(loadFront());

render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>,
    document.getElementById('root')
)

/*
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
*/

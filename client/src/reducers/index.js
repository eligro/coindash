import { combineReducers } from 'redux';
import exchanges from './exchange.reducer';
import charts from './chart.reducer';
import balances from './balances.reducer';
import coins from './coins.reducer';

const rootReducer = combineReducers({
    exchanges,
    charts,
    balances,
    coins
})

export default rootReducer;
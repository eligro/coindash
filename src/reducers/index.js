import { combineReducers } from 'redux';
import exchanges from './exchange.reducer';
import charts from './chart.reducer';
import balances from './balances.reducer';

const rootReducer = combineReducers({
    exchanges,
    charts,
    balances
})

export default rootReducer;
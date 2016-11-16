import { combineReducers } from 'redux';
import exchanges from './exchange.reducer';

const rootReducer = combineReducers({
    exchanges
})

export default rootReducer;
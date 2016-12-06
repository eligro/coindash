import * as types from './action.const';
import BalancesAPI from '../api/mockBalancesApi';


export function loadBalancesSuccess(data) {
    return {type: types.LOAD_BALANCES_SUCCESS, data};
}

export function loadBalances() {
    return (dispatch) => {
        return BalancesAPI.getData().then(data => {
            dispatch(loadBalancesSuccess(data));
        }).catch(error => {
            throw(error);
        })
    }
}
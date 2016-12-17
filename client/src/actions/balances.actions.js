import * as types from './action.const';
//import BalancesAPI from '../api/mockBalancesApi';
import {AccountsManager} from '../utils/Accounts/AccountsManager';


export function loadBalancesSuccess(data) {
    return {type: types.LOAD_BALANCES_SUCCESS, data};
}

export function loadBalances() {
    return (dispatch) => {
        let manager = AccountsManager.hardcodedManager();
        manager.getBalances(function (data) {
            dispatch(loadBalancesSuccess(data));
        });
    }
}

/*
export function loadBalances() {
    return (dispatch) => {
        return BalancesAPI.getData().then(data => {
            dispatch(loadBalancesSuccess(data));
        }).catch(error => {
            throw(error);
        })
    }
}*/

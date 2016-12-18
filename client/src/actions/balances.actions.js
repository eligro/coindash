import * as types from './action.const';
//import BalancesAPI from '../api/mockBalancesApi';
import {ETHWallet} from '../utils/Accounts/Ethereum/ETHWallet';
import {PoloniexAccount} from '../utils/Accounts/Poloniex/PoloniexAccount';
import {AccountsManager} from '../utils/Accounts/AccountsManager';


export function loadBalancesSuccess(data) {
    return {type: types.LOAD_BALANCES_SUCCESS, data};
}

export function loadBalances() {
    return (dispatch, getState) => {
        let ethTokens = getState().exchanges.filter(i => i.type === 'ethereum').map(i => i.token);
        var accounts = [];

        if (ethTokens.length) {
            let wallet = new ETHWallet(ethTokens);
            accounts = wallet.getAccounts();
        }

        getState().exchanges.filter(i => i.type === 'polonix').forEach(i => {
            console.log(i);
            let poloniexAccount = new PoloniexAccount(i.token, i.secret);
            accounts.push(poloniexAccount);
        })

        if (accounts.length) {
            let manager = new AccountsManager(accounts);
            manager.getBalances(function (data) {
                dispatch(loadBalancesSuccess(data));
            });
        }

    }
}

export function clearBalances() {
    return {type: types.DELETE_EXCHANGE};
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

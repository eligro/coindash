import { ETHWallet } from './Ethereum/ETHWallet';
import { PoloniexAccount } from './Poloniex/PoloniexAccount';
import { Account } from './Account';
import { AccountsBalanceUtils } from './AccountsBalanceUtils';
import { AccountsTradesUtils } from './AccountsTradesUtils';
import { AccountsDepositAndWithdrawalUtils } from './AccountsDepositAndWithdrawalUtils';
import { AccountsCalcUtils } from './AccountsCalcUtils';
import { Utils } from '../../utils/utils/Utils';
import { WithdrawlDeposit } from '../../utils/Trades/WithdrawlDeposit';
import { Trade } from '../../utils/Trades/Trade';
import { Token } from '../../utils/Trades/Token';
import BigNumber from 'bignumber.js';
import { ExchangeProvider } from '../../utils/ExchangeProvider/ExchangeProvider';

export class AccountsManager {
	static hardcodedManager() {
		let wallet = ETHWallet.hardcoded();
		let accounts = wallet.getAccounts();

		// let poloniexAccount = new PoloniexAccount(
		// 		"LGD0CO3H-3TVGSTOJ-WWYE2BGU-JBEB00EC",
		// 		"2a99daaa0401620babe544669ccb9495d744ef4def03cd0ddb39d9594c8fd5959acee6818c29a05a4353ca3b4695a3d640c5041a79ab07c35e532b196e14d9ce"
		// 	);
		let poloniexAccount = new PoloniexAccount(
				"6R25SW6B-OCHTH66W-VONNICW7-72GYFIJB",
				"2ffccecbae9bfcf3c330c27eff9de6f82260def1b1165bd61ff4b92857cd2d21ea99f8860b22d7fbed496c9a36edd546265c41d2ae1c98c613746f035548a0f4"
			);
		accounts.push(poloniexAccount);

		return new AccountsManager(accounts);
	}

	constructor(accounts) {
		this.accounts = accounts;
	}


	// API
	getBalances(callback) {
		AccountsBalanceUtils.fetchBalances(this.accounts, function(data) {			
			let exchangeProvider = ExchangeProvider.coinMarketCapProvider();
			exchangeProvider.getBalances(data, function(balances) {
				// prepare for standard objects
				let ret = [];
				for (let i in balances) {
					let obj = balances[i];
					let token = obj.token;
					let fiatValue = obj.balance;
					let cryptoAmount = token.balance.toNumber();

					ret.push({
						"title" : token.symbol,
						"amount" : cryptoAmount,
						"value" : fiatValue
					});
				}
				callback(ret);
			});
		});
	}

	dayStatusFromDate(fromDate, callback) {
		let executed = 0;
		let executions = 3;

		let balances = null;
		let trades = null;
		let deposits = null;
		let withdrawals = null;

		let parentObj = this;

		AccountsBalanceUtils.fetchBalances(this.accounts, function(data) {
			balances = data;

			console.log("fethced accounts balance");

			executed += 1;
			if (executed == executions) {
				parentObj.calcDayStatusObject(fromDate, balances, trades, deposits, withdrawals, callback);
			}
		});


		AccountsTradesUtils.fetchTrades(this.accounts, function(data) {
			trades = data;

			console.log("fethced accounts trades");

			executed += 1;
			if (executed == executions) {
				parentObj.calcDayStatusObject(fromDate, balances, trades, deposits, withdrawals, callback);
			}
		});

		AccountsDepositAndWithdrawalUtils.fetch(this.accounts, function(openWithdrawals, openDeposits) {
			deposits = openDeposits;
			withdrawals = openWithdrawals;

			console.log("fethced accounts withdrawals and deposits");

			executed += 1;
			if (executed == executions) {
				parentObj.calcDayStatusObject(fromDate, balances, trades, deposits, withdrawals, callback);
			}
		});
	}


	// UTILS
	calcDayStatusObject(fromDate, currentBalances, trades, deposits, withdrawals, callback) {
		let days = [];
		let dayTime = 24 * 60 * 60;

		// prepare days array
		let endOfToday = new Date();
		endOfToday.setHours(23);   // set hours to 0
		endOfToday.setMinutes(59); // set minutes to 0
		endOfToday.setSeconds(59); // set seconds to 0
		let currentUnix = Math.floor(endOfToday / 1000);
		while (currentUnix > fromDate) {
			days.push({
				"timestamp" : currentUnix,
				"trades" : [],
				"deposits" : [],
				"withdrawals" : [],
				"balances" : [],
				"delta" : 0,
			});
			currentUnix -= dayTime;
		}

		// today has the current balance
		days[0].balances = currentBalances;

		// append trades, open deposits and withdrawals
		for (let dayIdx in days) {
			let day = days[dayIdx];

			// trades
			for (let tradeIdx in trades) {
				let trade = trades[tradeIdx];

				if (trade.timestamp < (day.timestamp - dayTime)) break;
				
				if (trade.timestamp <= day.timestamp) {
					day.trades.push(trade);
				}
			}

			// deposits
			for (let depositIdx in deposits) {
				let deposit = deposits[depositIdx];
				
				if (deposit.timestamp <= day.timestamp && deposit.timestamp > (day.timestamp - dayTime)) {
					day.deposits.push(deposit);
				}
			}

			// withdrawals
			for (let withdIdx in withdrawals) {
				let withdrawal = withdrawals[withdIdx];
				
				if (withdrawal.timestamp <= day.timestamp && withdrawal.timestamp > (day.timestamp - dayTime)) {
					day.withdrawals.push(withdrawal);
				}
			}
		}
		console.log("ordered day data");

		// calc balances
		days = AccountsCalcUtils.calcBalances(days);

		console.log("calculated balances");

		let exchangeProvider = ExchangeProvider.coinMarketCapProvider();
		exchangeProvider.valueForDays(days, function(daysValues){
			console.log("calculated USD daily value");
	        
	        let ret = {
	        	"portfolio" : AccountsCalcUtils.calcDayDelta(daysValues)
	        }

	        exchangeProvider.getTokenDayStatus(Token.BTC(), "usd", fromDate, function(data) {
                ret["market"] = data;

                callback(ret);
            });
        });  		
	}
}
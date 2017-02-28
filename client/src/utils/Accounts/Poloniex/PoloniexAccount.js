import { Account } from '../Account.js';
import { PoloniexAPI } from './PoloniexAPI'
import { Token } from '../../Trades/Token'
import { Trade } from '../../Trades/Trade'
import { WithdrawlDeposit } from '../../Trades/WithdrawlDeposit'
import moment from 'moment';
import BigNumber from 'bignumber.js';

export class PoloniexAccount extends Account {
	constructor(api_key, secret) {
		super("Poloniex");
		this.api_key = api_key;
		this.secret = secret;
	}

	getTrades(callback) {
		let parentObj = this;
		this.fetchPoloniexTrades(function(trades, error) {
			if (error != null) {
				console.log(error);
			}
			else {
				let data = parentObj.parsePoloniexTradeData(trades);
				callback(data);
			}
		});
	}

	getBalances(callback) {
		let poloniex = new PoloniexAPI(this.secret, this.api_key)
		poloniex.fetchBalances(function(data) {
			var tokens = [];
			for (let i in data) {
				let t = Token.fromSymbol(i);
				t.balance = new BigNumber(parseFloat(data[i]));
				tokens.push(t);
			}

			callback(tokens);
		});
	}

	getTransactionHistory(callback) {
		
	}

	getWithdrawAndDepositHistory(callback) {
		let parentObj = this;
		this.fetchPoloniexWithdrawlAndDepositHistory(function(history, error) {
			// console.log(history);
			if (error == null) {
				let ret = [];

				let deposits = history.deposits;
				for (let i in deposits) {
					let depo = deposits[i];
					ret.push(new WithdrawlDeposit(
							WithdrawlDeposit.Types().Deposit,
							depo.timestamp,
							Token.fromSymbol(depo.currency),
							depo.amount,
							depo.address,
							parentObj,
							depo
						));
				}
				

				let withdrawals = history.withdrawals;
				for (let i in withdrawals) {
					let depo = withdrawals[i];
					ret.push(new WithdrawlDeposit(
							WithdrawlDeposit.Types().Withdrawl,
							depo.timestamp,
							Token.fromSymbol(depo.currency),
							depo.amount,
							depo.address,
							parentObj,
							depo
						));
				}

				callback(ret);
			}
			else {
				console.log(error);
			}
		});
	}

	// private
	fetchPoloniexTrades(callback) {
		let poloniex = new PoloniexAPI(this.secret, this.api_key)
		poloniex.fetchAllTradeHistory(callback);
	}

	fetchPoloniexWithdrawlAndDepositHistory(callback) {
		let poloniex = new PoloniexAPI(this.secret, this.api_key)
		poloniex.fetchWithdrawlAndDepositHistory(callback);
	}

	parsePoloniexTradeData(data) {
		let _ret = []
		for(let k in data) {
			let tokens = this.tokensFromCurrencyPair(k);
			let lhs = tokens[0];
			let rhs = tokens[1];

			let trades = data[k];
			for(let idx in trades) {
				let trade = trades[idx];
				if (trade.category === "exchange") {			
					let t = this.tradeFromPoloniexDic(lhs, rhs, trade);
					if (t != null) {
						_ret.push(t);
					}
				}
			}
		}
		
		return _ret;
	}

	tradeFromPoloniexDic(lhsToken, rhsToken, dic) {
		if (dic.type === "buy") {
			return new Trade(
					Trade.Source().Poloniex,
					Trade.Types().Buy,
					lhsToken,
					parseFloat(dic.total),
					rhsToken,
					parseFloat(dic.amount),
					moment(dic.date).unix()
				);
		}
		else { // sell
			return new Trade(
					Trade.Source().Poloniex,
					Trade.Types().Sell,
					lhsToken,
					dic.total,
					rhsToken,
					dic.amount,
					moment(dic.date).unix()
				)
		}
	}

	tokensFromCurrencyPair(currencyPair) {
		let val = currencyPair.split("_");

		return [
			Token.fromSymbol(val[0]),
			Token.fromSymbol(val[1])
		];
	}
}
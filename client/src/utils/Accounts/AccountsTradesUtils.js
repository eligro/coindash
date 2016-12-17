import { Utils } from '../../utils/utils/Utils';

export class AccountsTradesUtils {
	static fetchTrades(accounts, callback) {
		this.fetchTradeHistoryForAccount(accounts, 0, {}, function(trades){
			let concat = Utils.concatArrayOfArrays(trades);
			let sorted =  Utils.sortTrades(concat)
          	callback(sorted);
		});
	}

	static fetchTradeHistoryForAccount(accounts, idx, tradesDic, callback) {
		if (idx == accounts.length) {
			callback(tradesDic);
			return;
		}

		let account = accounts[idx];

		account.getTrades(function(trades) {
			tradesDic[idx] = trades;
			AccountsTradesUtils.fetchTradeHistoryForAccount(accounts, idx + 1, tradesDic, callback);
 		});
	}
}
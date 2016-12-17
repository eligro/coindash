import BigNumber from 'bignumber.js';

export class AccountsBalanceUtils {
	static fetchBalances(accounts, callback) {
		AccountsBalanceUtils.fetchBalanceForAccount(accounts, 0, {}, function(tokenLst){
			let balances = []
	     	for(let k in tokenLst) {
	        	let l = tokenLst[k];
	        	let t = l[0];
	        	for (let i=1 ; i < l.length ; i++) {
	          		let t2 = l[i];
	          		t.addToBalance(t2.balance);
	        	}

	        	if (t.balance.toNumber() > 0) {
	        		balances.push(t);
	        	}	        	
	      	}

	      	callback(balances);
		});
	}

	static fetchBalanceForAccount(accounts, idx, tokenLst, callback) {
		if (idx == accounts.length) {
			callback(tokenLst);
			return;
		}

		let account = accounts[idx];

		account.getBalances(function(tokens) {
			for (let i in tokens) {
				let t = tokens[i];
				if (tokenLst[t.symbol] == null) {
					tokenLst[t.symbol] = [t];
				}
				else {
					tokenLst[t.symbol].push(t);
				}
			}

			AccountsBalanceUtils.fetchBalanceForAccount(accounts, idx + 1, tokenLst, callback);
 		});
	}
}
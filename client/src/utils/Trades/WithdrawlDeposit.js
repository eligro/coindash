import { Token } from './Token';
import BigNumber from 'bignumber.js';

export class WithdrawlDeposit {
	static Types() {
		return {
			"Withdrawl": "Withdrawl",
			"Deposit": "Deposit"
		};
	}

	constructor(type, date, token, amount, address, account, rawTx) {
		this.type = type;
		this.timestamp = date;
		this.token = token;
		this.amount = amount;
		this.address = address
		this.account = account;
		this.rawTx = rawTx;

		this.counterpart = null;
	}
}
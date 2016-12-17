
import { Token } from '../../Trades/Token';
import BigNumber from 'bignumber.js';
import { Trade } from '../../Trades/Trade'
import { WithdrawlDeposit } from '../../Trades/WithdrawlDeposit'

export class ERC20Data {
	static OperationType() {
		return {
			"Transfer": 1,
			"Balance": 2,
			"Buyin": 3
		};
	}

	constructor(type, account, value, tx, timestamp) {
		this.type = type;
		this.account = account;
		this.value = value;
		this.timestamp = timestamp;
		this.tx = tx;
	}

  	getTrade() {
		// currently we only support buyin of ICO token
	 	let ret = new Trade(
	 		Trade.Source().ETH_Blockchain,
			Trade.Types().Buy,
			Token.ETH(),
			parseFloat(this.value),
			this.tx.tokenTransaction,
			0, // TODO - how to find out the amount of token purchsed
			parseInt(this.timestamp)
		);
		ret.id = this.tx.nonce;
		return ret;
	}

	getDepositWithdrawl(account) {
		if (this.type === ERC20Data.OperationType().Transfer) {
			if (this.account.toLowerCase() === account.toLowerCase()) {
				return new WithdrawlDeposit(
								WithdrawlDeposit.Types().Deposit,
								parseInt(this.timestamp),
								this.tx.tokenTransaction,
								parseFloat(this.value),
								this.account,
								this.tx
							);
			}
			else {
				return new WithdrawlDeposit(
								WithdrawlDeposit.Types().Withdrawl,
								parseInt(this.timestamp),
								this.tx.tokenTransaction,
								parseFloat(this.value),
								this.account,
								this.tx
							);
			}
		}

		return null;
	}
}

export class ETHTransaction {
	constructor(blockNumber,
		timeStamp,
		hash,
		txIdx,
		from,
		to,
		value,
		gas,
		input,
		contractAddress,
		confirmations,
		nonce) {

		
		this.timeStamp = timeStamp;
		this.from = from;
		this.to = to;
		this.contractAddress = contractAddress;
		this.value = value;
		this.txIdx = txIdx;
		this.gas = gas;
		this.input = input;
		this.confirmations = confirmations;
		this.nonce = nonce;
		this.blockNumber = blockNumber;
		this.hash = hash;

		// if this tx is for a token contract this var will hold that token
		this.tokenTransaction = null;

		this.isICOBuyin = false;
	}

	// TODO - refactor to ont use Token
	weiBalance() {
		let t = new Token('', '', "ETH", 0);
		t.balance = this.value;
		return t.weiBalance();
	}

	getERC20Data() {
		if (this.tokenTransaction == null) { return null; }

		// buyin
		if (this.tokenTransaction != null && this.value > 0) {
			return new ERC20Data(ERC20Data.OperationType().Buyin,
				this.from,
				this.weiBalance(),
				this,
				this.timeStamp);
		}

		// transfer tokens
		if(this.input.startsWith(this.tokenTransaction.transferHex)) {
			let idxStart = this.tokenTransaction.transferHex.length + 64;
			let varlueHex = "0x" + this.input.substring(idxStart);
			
			let decimal = this.tokenTransaction.decimal;
			let _value = new BigNumber(varlueHex).div(new BigNumber(10).pow(decimal));

			let toAccount = "0x" + this.input.substring(34, 34 + 40);

			return new ERC20Data(ERC20Data.OperationType().Transfer,
				toAccount,
				_value.toString(10),
				this,
				this.timeStamp);
		}

		return null;
	}

	static fromEtherscanDic(data) {
		return new ETHTransaction(
				data.blockNumber,
				data.timeStamp,
				data.hash,
				data.transactionIndex,
				data.from,
				data.to,
				data.value,
				data.gas,
				data.input,
				data.contractAddress,
				data.confirmations,
				data.nonce
			);
	}
}
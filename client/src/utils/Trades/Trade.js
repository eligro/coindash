import { Token } from './Token';

export class Trade {
	static Types() {
		return {
			"Buy": 1,
			"Sell": 2
		};
	}

	static Source() {
		return {
			"ETH_Blockchain": "ETH_Blockchain",
			"Poloniex": "Poloniex"
		};
	}

	// example
	// Buy) i bought for 10 eth, 11 DAO
	// Sell) i sold for 10 eth, 5 DAO
	constructor(source, type, lhsToken, lhsValue, rhsToken, rhsValue, timestamp) {
		this.timestamp = timestamp;

		this.source = source;
		this.id = Math.random().toString(36);
		this.type = type;
		this.lhsToken = lhsToken;
		this.lhsValue = lhsValue;
		this.rhsToken = rhsToken;
		this.rhsValue = rhsValue;
		this.fee = 0;
		this.executedOn = "";
	}

	closeTrade(trade) {
		this.closed = true;
		this.whenClosed = trade.timestamp;
		this.remainingAmount = 0;
		this.closingTrade = trade;
	}

	serialize() {
		return {
			"source": this.source,
			"id": this.id,
			"type": this.type,
			"lhsToken": this.lhsToken.serialize(),
			"lhsValue": this.lhsValue,
			"rhsToken": this.rhsToken.serialize(),
			"rhsValue": this.rhsValue,
			"timestamp": this.timestamp
		};
	}

	pretty() {
		if (this.type === Trade.Types().Buy) {
			return this.source + ") Bought " + this.rhsValue + this.rhsToken.symbol + " for " + this.lhsValue + this.lhsToken.symbol; 
		}
		return this.source + ") Sold " + this.rhsValue + this.rhsToken.symbol + " for " + this.lhsValue + this.lhsToken.symbol;  
	}

	static fromDic(dic) {
		let ret =  new Trade(
				dic.source,
				dic.type,
				Token.fromDic(dic.lhsToken),
				dic.lhsValue,
				Token.fromDic(dic.rhsToken),
				dic.rhsValue,
				dic.timestamp
			);
		ret.id = dic.id;
		return ret;
	}
}
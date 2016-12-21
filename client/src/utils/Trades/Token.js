
import BigNumber from 'bignumber.js';

export class Token {

	constructor(contractAddress, userAddress, symbol, decimal) {
	    this.contractAddress = contractAddress;
		this.userAddress = userAddress
		this.symbol = symbol;
		this.decimal = decimal;
		this.balance = new BigNumber(0);
		this.balanceHex = "0x70a08231";
		this.transferHex = "0xa9059cbb";

		this.unitMap = {
			'wei': '1',
			'kwei': '1000',
			'ada': '1000',
			'femtoether': '1000',
			'mwei': '1000000',
			'babbage': '1000000',
			'picoether': '1000000',
			'gwei': '1000000000',
			'shannon': '1000000000',
			'nanoether': '1000000000',
			'nano': '1000000000',
			'szabo': '1000000000000',
			'microether': '1000000000000',
			'micro': '1000000000000',
			'finney': '1000000000000000',
			'milliether': '1000000000000000',
			'milli': '1000000000000000',
			'ether': '1000000000000000000',
			'kether': '1000000000000000000000',
			'grand': '1000000000000000000000',
			'einstein': '1000000000000000000000',
			'mether': '1000000000000000000000000',
			'gether': '1000000000000000000000000000',
			'tether': '1000000000000000000000000000000'
		};
	}

	static hardcodedTokes() {
		return [
			Token.ETH(),
			Token.ETC(),
			Token.DAO(),
			Token.DGD(),
			Token.MKR(),
			Token.Unicorn(),
			Token.BeerCoin(),
			Token.HKG(),
			Token.ICN(),
			Token.PLU(),
			Token.REP(),
			Token.SNGLS(),
			Token.GNT()
		];
	}

	static fromSymbol(symbol) {
		let all = Token.hardcodedTokes();
		for (let idx in all) {
			let t = all[idx];
			if (t.symbol === symbol) {
				return Token.fromDic(t);
			}
		}

		let ret = new Token();
		ret.symbol = symbol;
		return ret;
	}

	static BTC() {
		let t = new Token();
		t.symbol = "BTC";
		return t;
	}

	static ETHDic() {
		return {
                "address": "",
                "symbol" : "ETH",
                "decimal" : 0
              };
	}

	static ETCDic() {
		return {
                "address": "",
                "symbol" : "ETC",
                "decimal" : 0
              };
	}

	static ETH() {
		return new Token.fromDic(Token.ETHDic());
	}

	static ETC() {
		return new Token.fromDic(Token.ETCDic());
	}

	static DAODic() {
		return {
                "address": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
                "symbol": "DAO",
                "decimal": 16
              };
	}

	static DAO() {
		return new Token.fromDic(Token.DAODic());
	}

	static DGDDic() {
		return {
                "address": "0xe0b7927c4af23765cb51314a0e0521a9645f0e2a",
                "symbol": "DGD",
                "decimal": 9
              };
	}

	static DGD() {
		return new Token.fromDic(Token.DGDDic());
	}

	static MKRDic() {
		return {
                "address": "0xc66ea802717bfb9833400264dd12c2bceaa34a6d",
                "symbol": "MKR",
                "decimal": 18
              };
	}

	static MKR() {
		return new Token.fromDic(Token.MKRDic());
	}

	static UnicornDic() {
		return {
                "address": "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
                "symbol": "🦄 Unicorn",
                "decimal": 0
              };
	}

	static Unicorn() {
		return new Token.fromDic(Token.UnicornDic());
	}

	static BeerCoinDic() {
		return {
                "address": "0x74c1e4b8cae59269ec1d85d3d4f324396048f4ac",
                "symbol": "🍺 BeerCoin",
                "decimal": 0
              };
	}

	static BeerCoin() {
		return new Token.fromDic(Token.BeerCoinDic());
	}

	static HKGDic() {
		return {
		  "address": "0xb582baaf5e749d6aa98a22355a9d08b4c4d013c8",
		  "symbol": "HKG",
		  "decimal": 18,
		};
	}

	static HKG() {
		return new Token.fromDic(Token.HKGDic());
	}

	static ICNDic() {
		return {
		  "address": "0x888666CA69E0f178DED6D75b5726Cee99A87D698",
		  "symbol": "ICN",
		  "decimal": 18,
		};
	}

	static ICN() {
		return new Token.fromDic(Token.ICNDic());
	}

	static PLUDic() {
		return {
			"address": "0xD8912C10681D8B21Fd3742244f44658dBA12264E",
			"symbol": "PLU",
			"decimal": 18,
		};
	}

	static PLU() {
		return new Token.fromDic(Token.PLUDic());
	}

	static REPDic() {
		return {
			"address": "0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5",
			"symbol": "REP",
			"decimal": 18,
			"type": "default"
		};
	}

	static REP() {
		return new Token.fromDic(Token.REPDic());
	}

	static SNGLSDic() {
		return {
			"address": "0xaec2e87e0a235266d9c5adc9deb4b2e29b54d009",
			"symbol": "SNGLS",
			"decimal": 0,
		};
	}

	static SNGLS() {
		return new Token.fromDic(Token.SNGLSDic());
	}

	static GNTDic() {
		return {
			"address": "0xa74476443119A942dE498590Fe1f2454d7D4aC0d",
			"symbol": "GNT",
			"decimal": 18,
		};
	}

	static GNT() {
		return new Token.fromDic(Token.GNTDic());
	}

	// helper functions 
	static fromDic(dic) {
		let ret = new Token(dic.address,
							dic.userAddress,
							dic.symbol,
							dic.decimal);
		if (dic.balance != null) {
			ret.balance = new BigNumber(dic.balance);
		}
		return ret;
	}

	serialize() {
		return {
			"address": this.contractAddress,
			"symbol": this.symbol,
			"decimal": this.decimal,
			"userAddress": this.userAddress,
			"balance": this.balance
		};
	}

	copy() {
		return Token.fromDic(this.serialize());
	}

	// uitl
	prettyName() {
		return this.symbol;
	}

	prettyBalance() {
		return this.balance.toString(10);
	}

	// ajax utils
	getDataObj(to, func, arrVals) {
		var val="";
	    for(var i=0;i<arrVals.length;i++) val+=this.padLeft(arrVals[i],64);
	    return {to: to, data: func+val};
	}

	padLeft(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	getNakedAddress() {
		return this.userAddress.toLowerCase().replace('0x', '');
	}

	balanceCallData() {
		if (this.symbol != "ETH") {
			var data = this.getDataObj(this.contractAddress,
											 this.balanceHex, 
											 [this.getNakedAddress()]
										 );

			return {
					ethCall: data,
			        isClassic: false
				};
		}
		else if (this.symbol === "ETC") {
			return {
					balance: this.userAddress,
			        isClassic: true
					};
		}
		// ETH
		return {
					balance: this.userAddress,
			        isClassic: false
				};
	}


	// balance
	addToBalance(amount) {
		this.balance = this.balance.plus(amount);
	}

	reduceFromBalance(amount) {
		this.balance = this.balance.minus(amount);
	}

	weiBalance() {
		// wei
		var wei = new BigNumber(String(this.balance)).times(this.getValueOfUnit('wei'));
		wei = wei.toString(10);

		var returnValue = new BigNumber(wei).div(this.getValueOfUnit('ether'));
		return returnValue.toString(10);
	}

	getValueOfUnit(unit) {
		unit = unit ? unit.toLowerCase() : 'ether';
		var unitValue = this.unitMap[unit];
		if (unitValue === undefined) {
			throw 0;
		}
		return new BigNumber(unitValue, 10);
	}
}
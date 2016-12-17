import { Token } from '../../Trades/Token';
import { ETHTransaction } from './ETHTransaction';
import { ETHChainAccount } from './ETHChainAccount';

export class ETHWallet {
	static hardcoded() {
		// return new ETHWallet([
	 //    	"0xd7e10d75cf87abc5a2f34a83ccf27cd54108cbc3"
	 //    ]);

		return new ETHWallet([
	    	"0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778"
	    ]);
	}

	constructor(walletAddresses) {    
	    this.walletAddresses = walletAddresses;
	}

 	getAccounts() {
		let ret = []
		for (let idx in this.walletAddresses) {
	      	let address = this.walletAddresses[idx];
	      	ret.push(new ETHChainAccount(address, ETHWallet.allTokens()));
      	}
      	return ret;
	}

	// tokens
	addToken(token) {
		this.addToken(token.symbol, token.contractAddress, token.decimal);
	}

	addToken(symbol, address, decimal) {
		console.log("adding token with symbol: " + symbol + ", address: " + address + ", decimal: " + decimal);
		var tokens = Wallet.savedTokens() 
		tokens.push({
					address: address,
					symbol: symbol,
					decimal: decimal
				});
		localStorage.setItem("localTokens",JSON.stringify(tokens));
	}

	static allTokens() {
		return ETHWallet.savedTokens().concat(Token.hardcodedTokes());
	}


	static savedTokens() {
	    let dics = localStorage.getItem("localTokens") != null ? JSON.parse(localStorage.getItem("localTokens")) : [];
	    let ret = [];
	    for (let i in dics) {
	    	let d = dics[i];
	    	ret.push(new Token.fromDic(d));
	    }
	    return ret;
	}
}

const Wallet = ETHWallet.hardcoded();
export default Wallet;
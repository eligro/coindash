import { Token } from '../../Trades/Token'
import BigNumber from 'bignumber.js';

export class ETHHelper {
	static fetchBalanceForToken(token, walletAddress, callback) {
		if (token.symbol === "ETH") {
			ETHHelper.fetchETHTokenBalance(token, walletAddress, callback);
		}
		else {
			ETHHelper.fetchERC20TokenBalance(token, walletAddress, callback);
		}
	}

	static fetchERC20TokenBalance(token, walletAddress, callback) {
		let serverUrl = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=";
	    serverUrl += token.contractAddress;
	    serverUrl += "&address=";
	    serverUrl += walletAddress;
	    serverUrl += "&tag=latest&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU";
	    let parentObj = this;

	    fetch(serverUrl, {
	      method: 'get'
	    })
	    .then((response) => response.json())
	    .then((data) => {
	      if (data.status === '1') {
	      	token.balance = new BigNumber(data.result).div(token.getValueOfUnit('ether'));
	        callback(token, token.balance);
	      }
	      else {
	      	callback(token, new BigNumber(0));
	      }
	    })
	    .catch((error) => {
	      console.error(error);
	      alert("Some problems with the account, try again later");
	    });
	}

	static fetchETHTokenBalance(token, walletAddress, callback) {
		// https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=YourApiKeyToken
		let serverUrl = "https://api.etherscan.io/api?module=account&action=balance&address=";
	    serverUrl += walletAddress;
	    serverUrl += "&tag=latest&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU";
	    let parentObj = this;

	    fetch(serverUrl, {
	      method: 'get'
	    })
	    .then((response) => response.json())
	    .then((data) => {
	      if (data.status === '1') {
	      	token.balance = new BigNumber(data.result).div(token.getValueOfUnit('ether'));
	        callback(token, token.balance);
	      }
	      else {
	      	callback(token, new BigNumber(0));
	      }
	    })
	    .catch((error) => {
	      console.error(error);
	      alert("Some problems with the account, try again later");
	    });
	}
}
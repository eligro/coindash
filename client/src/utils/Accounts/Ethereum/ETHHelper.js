import { Token } from '../../Trades/Token'
import BigNumber from 'bignumber.js';
import { ETHTransaction, ERC20Data } from './ETHTransaction'
import { EtherscanGetTask } from './EtherscanGetTask'
import { Networker } from '../../Networking/Networker'

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
		// let serverUrl = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=";
	 //    serverUrl += token.contractAddress;
	 //    serverUrl += "&address=";
	 //    serverUrl += walletAddress;
	 //    serverUrl += "&tag=latest&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU";

	 	let parentObj = this;

	 	Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchERC20TokenBalanceTask(token, walletAddress))
	    

	    // fetch(serverUrl, {
	    //   method: 'get'
	    // })
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
	      // alert("Some problems with the account, try again later");
	    });
	}

	static fetchETHTokenBalance(token, walletAddress, callback) {
		// let serverUrl = "https://api.etherscan.io/api?module=account&action=balance&address=";
	 //    serverUrl += walletAddress;
	 //    serverUrl += "&tag=latest&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU";
	    let parentObj = this;

	    Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchETHTokenBalanceTask(token, walletAddress))

	    // fetch(serverUrl, {
	    //   method: 'get'
	    // })
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
	      // alert("Some problems with the account, try again later");
	    });
	}

	static fetchTxsForAccount(account, callback) {
		// let prefix = 'http://api.etherscan.io/api?module=account&action=txlist&address='
	 //    let suffix = '&startblock=0&endblock=99999999&sort=asc&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU'
	 //    let serverUrl = prefix + account + suffix


	 	Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchTxsForAccountTask(account))

	    // fetch(serverUrl, {
	    //   method: 'get'
	    // })
	    .then((response) => response.json())
	    .then((data) => {
	        if (data.status === '1') {
	          let _txs = []
	          for (let idx in data.result) {
	            if (data.result[idx].isError === '0') {
	              _txs.push(ETHTransaction.fromEtherscanDic(data.result[idx]))
	            }
	          }
	          callback(_txs)
	        } else {
	          // handle error
	          let _txs = []
	          callback(_txs)
	        }
	    })
	    .catch((error) => {
	        console.error(error)
	        // alert("Some problems with the account, try again later");
	    })
	}

	static fetchTokenContractTxList (tokens, token, account, callback) {
		if (token.contractAddress === null || token.contractAddress.length === 0) {
	      callback([])
	      return
	    }

	    // let prefix = 'http://api.etherscan.io/api?module=account&action=txlist&address='
	    // let suffix = '&startblock=0&endblock=99999999&sort=asc&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU'
	    // let serverUrl = prefix + token.contractAddress + suffix

	    let parentObj = this

	    Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchTokenContractTxListTask(token))

	    // fetch(serverUrl, {
	    // 	method: 'get'
	    // })
	    .then((response) => response.json())
	    .then((data) => {
	        if (data.status === '1') {
	        	let _txs = []

	        	for (let idx in data.result) {
		            if (data.result[idx].isError === '0') {
		              	let tx = ETHTransaction.fromEtherscanDic(data.result[idx])
		              	tx.tokenTransaction = ETHHelper.findTokenICOTrade(tokens, tx)
		              	let erc20Data = tx.getERC20Data()

		              	if (erc20Data != null &&
			            	erc20Data.type === ERC20Data.OperationType().Transfer &&
			            	erc20Data.account.toLowerCase() === account.toLowerCase()) {
			                	_txs.push(tx)
			        	}
		            }
	        	}

	        	callback(_txs)
	        } else {
	          // handle error
	          console.log(data)
	        }
	    })
	    .catch((error) => {
	    	console.error(error)
	        // alert("Some problems with the account, try again later");
	    })
	}

	/*
		Given a transaciton and a token list, find if the transaction sent money to an ICO contract
	*/
	static findTokenICOTrade (tokens, tx) {
		for (let idx in tokens) {
		  let tokenAddress = tokens[idx].contractAddress.replace('0x', '')
		  let tokenICOAddress = ''
		  if (tokens[idx].ico_address) {
		    tokenICOAddress = tokens[idx].ico_address.replace('0x', '')
		  }

		  let txTo = tx.to.replace('0x', '')

		  if (tokenAddress.toLowerCase() === txTo.toLowerCase() ||
		    tokenICOAddress.toLowerCase() === txTo.toLowerCase()) {
		    return tokens[idx]
		  }
		}
		return null
  }
}
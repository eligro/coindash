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

	 	let parentObj = this;

	 	Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchERC20TokenBalanceTask(token, walletAddress))
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
	      // console.error(error);
	      // alert("Some problems with the account, try again later");
	    });
	}

	static fetchETHTokenBalance(token, walletAddress, callback) {
	    let parentObj = this;

	    Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchETHTokenBalanceTask(token, walletAddress))
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
	      // console.error(error);
	      // alert("Some problems with the account, try again later");
	    });
	}

	static fetchTxsForAccount(account, callback) {

	 	Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchTxsForAccountTask(account))
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
	        // console.error(error)
	        // alert("Some problems with the account, try again later");
	    })
	}

	static fetchTokenContractTxList (tokens, token, account, callback) {
		if (token.contractAddress === null || token.contractAddress.length === 0) {
	      callback([])
	      return
	    }

	    let parentObj = this

	    Networker
	 	.instance()
	 	.start(EtherscanGetTask.fetchTokenContractTxListTask(token))
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
	    	// console.error(error)
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
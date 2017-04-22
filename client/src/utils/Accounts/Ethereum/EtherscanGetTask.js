import { GetTask } from '../../Networking/GetTask'
import { Token } from '../../Trades/Token'

export class EtherscanGetTask extends GetTask {

	static apiKey() {
		return "38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU";
	}

	static fetchERC20TokenBalanceTask(token, walletAddress) {
		let serverUrl = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=";
	    serverUrl += token.contractAddress;
	    serverUrl += "&address=";
	    serverUrl += walletAddress;
	    serverUrl += "&tag=latest&apikey=";
	    serverUrl += EtherscanGetTask.apiKey();

	    return new EtherscanGetTask(serverUrl);
	}

	static fetchETHTokenBalanceTask(token, walletAddress) {
		let serverUrl = "https://api.etherscan.io/api?module=account&action=balance&address=";
	    serverUrl += walletAddress;
	    serverUrl += "&tag=latest&apikey=";
	    serverUrl += EtherscanGetTask.apiKey();

	    return new EtherscanGetTask(serverUrl);
	}

	static fetchTxsForAccountTask(account) {
		let prefix = 'http://api.etherscan.io/api?module=account&action=txlist&address='
	    let suffix = '&startblock=0&endblock=99999999&sort=asc&apikey=';
	    let serverUrl = prefix + account + suffix + EtherscanGetTask.apiKey();

	    return new EtherscanGetTask(serverUrl);
	}

	static fetchTokenContractTxListTask(token) {
		let prefix = 'http://api.etherscan.io/api?module=account&action=txlist&address=';
	    let suffix = '&startblock=0&endblock=99999999&sort=asc&apikey=';
	    let serverUrl = prefix + token.contractAddress + suffix + EtherscanGetTask.apiKey();

	    return new EtherscanGetTask(serverUrl);
	}

	// instance functions
	postFetchingResponseTransformation(response) {
		return response.json();
	}

	validateResponse(response) {
		return response.status === '1';
	}

	getError(response) {
		return response.message;
	}
}
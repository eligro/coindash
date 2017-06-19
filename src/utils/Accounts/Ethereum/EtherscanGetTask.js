import { GetTask } from '../../Networking/GetTask'

export class EtherscanGetTask extends GetTask {

  static apiKey () {
    return '38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU'
  }

  static fetchERC20TokenBalanceTask (token, walletAddress) {
    let serverUrl = 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress='
    serverUrl += token.contractAddress
    serverUrl += '&address='
    serverUrl += walletAddress
    serverUrl += '&tag=latest&apikey='
    serverUrl += EtherscanGetTask.apiKey()
    let prom = new EtherscanGetTask(serverUrl)
    return prom
  }

  static fetchETHTokenBalanceTask (token, walletAddress) {
    let serverUrl = 'https://api.etherscan.io/api?module=account&action=balance&address='
    serverUrl += walletAddress
    serverUrl += '&tag=latest&apikey='
    serverUrl += EtherscanGetTask.apiKey()

    return new EtherscanGetTask(serverUrl)
  }

  static fetchTxsForAccountTask (account) {
    let prefix = 'https://api.etherscan.io/api?module=account&action=txlist&address='
    let suffix = '&sort=desc&apikey='
    let serverUrl = prefix + account + suffix + EtherscanGetTask.apiKey()

    return new EtherscanGetTask(serverUrl)
  }

  static fetchTokenContractTxListTask (token) {
    let prefix = 'https://api.etherscan.io/api?module=account&action=txlist&address='
    let suffix = '&sort=desc&apikey='
    let serverUrl = prefix + token.contractAddress + suffix + EtherscanGetTask.apiKey()

    return new EtherscanGetTask(serverUrl)
  }

  // instance functions
  postFetchingResponseTransformation (response) {
    return response.json()
  }

  validateResponse (response) {
    /*
        We don't want to fail the request simply because no txs were found
    */
    return response.status === '1' || (response.status === '0' && response.message === "No transactions found")
  }

  getError (response) {
    return response.message
  }
}

import { Account } from '../Account.js'
import { Token } from '../../Trades/Token'
import { Trade } from '../../Trades/Trade'
import { WithdrawlDeposit } from '../../Trades/WithdrawlDeposit'
import { ETHTransaction, ERC20Data } from './ETHTransaction'
import { AjaxUtils } from '../../utils/AjaxUtils'
import { Utils } from '../../utils/Utils'
import BigNumber from 'bignumber.js'
import { ETHHelper } from './ETHHelper'

export class ETHChainAccount extends Account {
  constructor (ethAccount, watchedTokens) {
    super('Ethereum_' + ethAccount)

    this.ethAccount = ethAccount

    this.watchedTokens = watchedTokens

    // attach accoutn address
    for (var i = 0; i < this.watchedTokens.length; i++) {
      let t = this.watchedTokens[i]
      t.userAddress = this.ethAccount
    }
  }

  getTrades (callback) {
    this.fetchICOBuyinTrades(this.ethAccount, callback)
  }

  getBalances (callback) {
    this.fetchAllBalances(this.watchedTokens, 0, callback)
  }

  getTransactionHistory (callback) {
    this.fetchTxHistoryAndTokenHistory(this.ethAccount, function (txs) {
      callback(txs)
    })
  }

  getWithdrawAndDepositHistory (callback) {
    let parentObj = this
    this.getTransactionHistory(function (txs) {
      let ret = []
      for (let idx in txs) {
        let tx = txs[idx]

        tx.tokenTransaction = parentObj.findTokenICOTrade(tx)
        let erc20Data = tx.getERC20Data()
        if (erc20Data != null) { // ERC 20 action
          let d = erc20Data.getDepositWithdrawl(parentObj.ethAccount) // only ERC20 transfer req is returned
          if (d != null) {
            d.account = parentObj
            ret.push(d)
          }
        } else if (tx.value > 0) { // value transfer
          if (tx.from === parentObj.ethAccount) { // withdrawl
            ret.push(new WithdrawlDeposit(
              WithdrawlDeposit.Types().Withdrawl,
              parseInt(tx.timeStamp),
              Token.ETH(),
              tx.weiBalance(),
              tx.to,
              parentObj,
              tx
            ))
          } else { // deposit
            ret.push(new WithdrawlDeposit(
              WithdrawlDeposit.Types().Deposit,
              parseInt(tx.timeStamp),
              Token.ETH(),
              tx.weiBalance(),
              tx.from,
              parentObj,
              tx
            ))
          }
        }
      }
      callback(ret)
    })
  }

  // private
  fetchAllBalances (tokens, tokenIdx, callback) {
    let cntActions = 0
    for (let i = 0; i < tokens.length; i++) {
      cntActions++

      let token = tokens[i]

      this.fetchBalanceForToken(token, function (t, balance) {
        t.balance = balance

        cntActions--
        if (cntActions === 0) {
          callback(tokens)
        }
      })
    }
  }

  fetchBalanceForToken (token, callback) {
    ETHHelper.fetchBalanceForToken(token, this.ethAccount, callback)
  }

  // old MEW api

  // fetchBalanceForToken(token, callback) {
  //   let data = AjaxUtils.queryParams(token.balanceCallData());
  //     let serverUrl = "https://rpc.myetherwallet.com/api.mew";
  //     let parentObj = this;

  //     fetch(serverUrl, {
  //       method: 'post',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: data
  //     })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (!data.error) {
  //         if (token.symbol === "ETH" || token.symbol === "ETC") {
  //           token.balance = data.data.balance;
  //           token.balance = new BigNumber(token.weiBalance());
  //           callback(token.balance);
  //         }
  //         else {
  //           let decimal = token.decimal;
  //           let _balance = new BigNumber(data.data).div(new BigNumber(10).pow(decimal));
  //           token.balance = _balance;
  //           callback(_balance);
  //         }
  //       }
  //       else {
  //         callback(new BigNumber(0));
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  findTokenICOTrade (tx) {
    let allTokens = this.watchedTokens
    for (let idx in allTokens) {
      let tokenAddress = allTokens[idx].contractAddress.replace('0x', '')
      let tokenICOAddress = ''
      if (allTokens[idx].ico_address) {
        tokenICOAddress = allTokens[idx].ico_address.replace('0x', '')
      }

      let txTo = tx.to.replace('0x', '')

      if (tokenAddress.toLowerCase() === txTo.toLowerCase() ||
        tokenICOAddress.toLowerCase() === txTo.toLowerCase()) {
        return allTokens[idx]
      }
    }
    return null
  }

  fetchICOBuyinTrades (account, callback) {
    let parentObj = this
    this.fetchTxsForAccount(account, function (txs, error) {
      if (error != null) {
        callback(null, error)
      } else {
        let _ret = []
        for (let idx in txs) {
          let tx = txs[idx]
          tx.tokenTransaction = parentObj.findTokenICOTrade(tx)
          let erc20Data = tx.getERC20Data()
          if (erc20Data != null) {
            // buyin
            if (erc20Data.type === ERC20Data.OperationType().Buyin) {
              _ret.push(erc20Data.getTrade())
            }

            // transfer
            // else if (erc20Data.type === ERC20Data.OperationType().Transfer) {
            //   console.log(erc20Data.timestamp + ") Transfered " + erc20Data.value + " from " + tx.tokenTransaction.prettyName());
            // }
          }
        }

        callback(_ret, null)
      }
    })
  }

  fetchTxsForAccount (account, callback) {
    let prefix = 'http://api.etherscan.io/api?module=account&action=txlist&address='
    let suffix = '&startblock=0&endblock=99999999&sort=asc&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU'
    let serverUrl = prefix + account + suffix

    fetch(serverUrl, {
      method: 'get'
    })
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

  fetchTxHistoryAndTokenHistory (account, callback) {
    let parentObj = this

    this.fetchTxsForAccount(account, function (_txs) {
      // fetch token contract txs
      parentObj.fetchAllTokenContractTxList(0, parentObj.watchedTokens, [], account, function (txsLst) {
        txsLst.push(_txs)
        callback(Utils.concatArrayOfArrays(txsLst))
      })
    })
  }

  fetchAllTokenContractTxList (idx, tokens, balances, account, callback) {
    let cntActions = 0
    for (let i = 0; i < tokens.length; i++) {
      cntActions++

      let t = tokens[i]

      this.fetchTokenContractTxList(t, account, function (txs) {
        balances.push(txs)

        cntActions--
        if (cntActions == 0) {
          callback(balances)
        }
      })
    }
  }

  fetchTokenContractTxList (token, account, callback) {
    if (token.contractAddress == null || token.contractAddress.length == 0) {
      callback([])
      return
    }

    let prefix = 'http://api.etherscan.io/api?module=account&action=txlist&address='
    let suffix = '&startblock=0&endblock=99999999&sort=asc&apikey=38DE12F4P7CNASZBM3RRAEWPHJKMWQD2NU'
    let serverUrl = prefix + token.contractAddress + suffix

    let parentObj = this

    fetch(serverUrl, {
      method: 'get'
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === '1') {
          let _txs = []

          for (let idx in data.result) {
            if (data.result[idx].isError === '0') {
              let tx = ETHTransaction.fromEtherscanDic(data.result[idx])
              tx.tokenTransaction = parentObj.findTokenICOTrade(tx)
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
}

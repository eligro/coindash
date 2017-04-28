import { Token } from '../../Trades/Token'
// import { ETHTransaction } from './ETHTransaction';
import { ETHChainAccount } from './ETHChainAccount'
const { localStorage } = window

export class ETHWallet {
  static hardcoded () {
    return new ETHWallet([
      '0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778'

    ])
  }

  constructor (walletAddresses) {
    this.walletAddresses = walletAddresses
  }

  getAccounts () {
    let ret = []
    for (let idx in this.walletAddresses) {
      let address = this.walletAddresses[idx]

      ret.push(new ETHChainAccount(address, ETHWallet.allTokens()))
    }

    return ret
  }

  // tokens

  // static addToken(token) {
  //   console.log(token)
  //   this.addToken(token.address, token.symbol, token.decimal, token.contractAddress);

  // }

  static addToken (token) {
    console.log('adding token with address: ' + token.address + ', symbol: ' + token.symbol + ', contractAddress: ' + token.ico_contract_address + ', decimal: ' + token.decimal)

    var tokens = ETHWallet.allTokens()
    console.log(tokens)

    // check no duplicate tokens
    var contains = false
    for (var i = tokens.length - 1; i >= 0; i--) {
      if (ETHWallet.checkToken(token, tokens[i])) {
        contains = true
        break
      }
    }

    if (!contains) {
      let customTokens = localStorage.getItem('localTokens') != null ? JSON.parse(localStorage.getItem('localTokens')) : []

      console.log('adding token...')
      customTokens.push({
        'address': token.address,
        'symbol': token.symbol,
        'decimal': token.decimal,
        'ico_contract_address': token.ico_contract_address,
        'type': 'custom'
      })

      localStorage.setItem('localTokens', JSON.stringify(customTokens))
    }
  }

  static checkToken (addedToken, token) {
    if (addedToken.address === token.contractAddress &&
        addedToken.symbol === token.symbol &&
        addedToken.contractAddress === token.ico_address) {
      return true
    }
    return false
  }

  static allTokens () {
    return ETHWallet.savedTokens().concat(Token.hardcodedTokes())
  }

  static savedTokens () {
    let dics = localStorage.getItem('localTokens') != null ? JSON.parse(localStorage.getItem('localTokens')) : []

    let ret = []

    for (let i in dics) {
      let d = dics[i]

      ret.push(new Token.FromDic(d))
    }

    return ret
  }
}

const Wallet = ETHWallet.hardcoded()
export default Wallet

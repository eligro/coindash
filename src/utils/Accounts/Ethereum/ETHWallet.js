import { Token } from '../../Trades/Token'
import { ETHChainAccount } from './ETHChainAccount'
const { localStorage } = window

export class ETHWallet {
  static hardcoded () {
    return new ETHWallet([
      '0xfd6259c709Be5Ea1a2A6eC9e89FEbfAd4c095778'

    ])
  }

  constructor (walletAddresses, customTokens) {
    this.walletAddresses = [...walletAddresses.map(a => a.trim())]
    this.customTokens = customTokens
  }

  getAccounts () {
    let ret = []
    for (let idx in this.walletAddresses) {
      let address = this.walletAddresses[idx]

      let allTokens = this.customTokens.concat(Token.hardcodedTokes())
      ret.push(new ETHChainAccount(address, allTokens))
    }

    return ret
  }
}

const Wallet = ETHWallet.hardcoded()
export default Wallet


import BigNumber from 'bignumber.js'
import tokensJson from './eth_tokens.json'

export const unitMap = {
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
}

export class Token {
  constructor (contractAddress, userAddress, symbol, decimal) {
    this.contractAddress = contractAddress
    this.userAddress = userAddress
    this.symbol = symbol
    this.decimal = decimal
    this.balance = new BigNumber(0)
    this.balanceHex = '0x70a08231'
    this.transferHex = '0xa9059cbb'
    this.ico_address = ''
    this.fiatCurrency = 'usd'
    this.fiatValue = 0

    this.unitMap = {...unitMap}
  }

  static hardcodedTokes () {
    let ret = []
    for (let i in tokensJson) {
      let t = tokensJson[i]
      ret.push(new Token.FromDic(t))
    }

    ret.push(Token.ETH())

    return ret
  }

  static fromSymbol (symbol) {
    let all = Token.hardcodedTokes()
    for (let idx in all) {
      let t = all[idx]
      if (t.symbol === symbol) {
        return Token.FromDic(t)
      }
    }

    let ret = new Token()
    ret.symbol = symbol
    return ret
  }

  static BTC () {
    let t = new Token()
    t.symbol = 'BTC'
    return t
  }

  static ETHDic () {
    return {
      'address': '',
      'symbol': 'ETH',
      'decimal': 0
    }
  }

  static ETH () {
    return new Token.FromDic(Token.ETHDic())
  }

  // helper functions
  static FromDic (dic) {
    let ret = new Token(dic.address,
              dic.userAddress,
              dic.symbol,
              dic.decimal)
    ret.ico_address = dic.ico_contract_address
    ret.ico_initial_price_usd = dic.ico_initial_price_usd
    if (dic.balance != null) {
      ret.balance = new BigNumber(dic.balance)
    }
    return ret
  }

  serialize () {
    return {
      'address': this.contractAddress,
      'symbol': this.symbol,
      'decimal': this.decimal,
      'userAddress': this.userAddress,
      'balance': this.balance,
      'ico_initial_price_usd' : this.ico_initial_price_usd
    }
  }

  copy () {
    return Token.FromDic(this.serialize())
  }

  // uitl
  prettyName () {
    return this.symbol
  }

  prettyBalance () {
    return this.balance.toString(10)
  }

  // ajax utils
  getDataObj (to, func, arrVals) {
    var val = ''
    for (var i = 0; i < arrVals.length; i++) val += this.padLeft(arrVals[i], 64)
    return {to: to, data: func + val}
  }

  padLeft (n, width, z) {
    z = z || '0'
    n = `${n}`
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }

  getNakedAddress () {
    return this.userAddress.toLowerCase().replace('0x', '')
  }

  balanceCallData () {
    if (this.symbol !== 'ETH') {
      var data = this.getDataObj(this.contractAddress,
                       this.balanceHex,
                       [this.getNakedAddress()]
                     )

      return {
        ethCall: data,
        isClassic: false
      }
    } else if (this.symbol === 'ETC') {
      return {
        balance: this.userAddress,
        isClassic: true
      }
    }
    // ETH
    return {
      balance: this.userAddress,
      isClassic: false
    }
  }

  // balance
  addToBalance (amount) {
    this.balance = this.balance.plus(amount)
  }

  reduceFromBalance (amount) {
    this.balance = this.balance.minus(amount)
  }

  weiBalance () {
    // wei
    var wei = new BigNumber(String(this.balance)).times(this.getValueOfUnit('wei'))
    wei = wei.toString(10)

    var returnValue = new BigNumber(wei).div(this.getValueOfUnit('ether'))
    return returnValue.toString(10)
  }

  getValueOfUnit (unit) {
    unit = unit ? unit.toLowerCase() : 'ether'
    var unitValue = this.unitMap[unit]
    if (unitValue === undefined) {
      throw new Error('Unit value cannot be set to undefined')
    }
    return new BigNumber(unitValue, 10)
  }
}

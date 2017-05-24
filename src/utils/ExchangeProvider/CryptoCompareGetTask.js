import { GetTask } from '../Networking/GetTask'

export class CryptoCompareGetTask extends GetTask {
  static fetchRawTask (token) {
    let url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + token.symbol.toUpperCase() + '&tsym=USD&limit=1000'

    let ret = new CryptoCompareGetTask(url)
    ret.type = 'history_data'
    ret.token = token
    return ret
  }

  static fetchCurrentBalanceTask (token) {
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=' + token.symbol.toUpperCase() + '&tsyms=USD'

    let ret = new CryptoCompareGetTask(url)
    ret.type = 'current_price'
    ret.token = token
    return ret
  }

  // instance functions
  postFetchingResponseTransformation (response) {
    return response.json()
  }

  validateResponse (response) {
    if (this.type === 'current_price') {
      return response.USD != null
    }
    return response.Response === 'Success'
  }

  getError (response) {
    if (this.type === 'current_price') {
      return 'could not get price of ' + this.token.symbol
    }
    return 'could not get historical data for ' + this.token.symbol
  }
}

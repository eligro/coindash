import { GetTask } from '../Networking/GetTask'

export class CoinmarketcapGetTask extends GetTask {
  static fetchRawTask (token) {
    let url = 'http://coinmarketcap.northpole.ro/api/v5/history/' + token.symbol + '_2017.json'

    return new CoinmarketcapGetTask(url)
  }

  static fetchCurrentBalanceTask (token) {
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=' + token.symbol + '&tsyms=USD'

    return new CoinmarketcapGetTask(url)
  }

  // instance functions
  postFetchingResponseTransformation (response) {
    return response.json()
  }

  validateResponse (response) {
    return response.Response === 'Success'
  }
}

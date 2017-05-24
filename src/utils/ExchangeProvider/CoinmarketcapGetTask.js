import { GetTask } from '../Networking/GetTask'

export class CoinmarketcapGetTask extends GetTask {
  static fetchRawTask (token) {
    let url = 'http://coinmarketcap.northpole.ro/api/v5/history/' + token.symbol.toUpperCase() + '_2017.json'

    return new CoinmarketcapGetTask(url)
  }

  static fetchCurrentBalanceTask (token) {
    let url = 'http://coinmarketcap.northpole.ro/api/v5/' + token.symbol.toUpperCase() + '.json'


    return new CoinmarketcapGetTask(url)
  }

  // instance functions
  postFetchingResponseTransformation (response) {
    return response.json()
  }

  validateResponse (response) {
    return true
  }
}

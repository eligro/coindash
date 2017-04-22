const { fetch } = window

class CoinAPI {
  static getFront () {
    return fetch('http://www.coincap.io/front')
  }
}

export default CoinAPI

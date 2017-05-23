const { fetch } = window

class CoinAPI {
  static getFront () {
    return fetch('www.coincap.io/front')
  }
}

export default CoinAPI

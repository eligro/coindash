import { ExchangeDataFetcherBase } from './ExchangeDataFetcherBase'
import { ExchangeValuePoint, ExchangeDataPoint, TokenHistoricData } from './ExchangeProvider'
import { Networker } from '../Networking/Networker'
import { CoinmarketcapGetTask } from './CoinmarketcapGetTask'

// debugging
// import EthData from './CoinMarketCapETHRaw.json'

export default class CoinMarketCapFetcher extends ExchangeDataFetcherBase {
  fetch (token, callback, errorCallBack) {
    let parentObj = this
    this.fetchRaw(token, function (raw, error) {
      if (error == null) {
        parentObj.parseRaw(token, raw, callback)
      } else {
        errorCallBack(errorCallBack)
      }
    })
  }

  parseRaw (token, raw, callback) {
    if (!raw) {
      callback(new TokenHistoricData(token, []))
      return
    };

    let history = raw.history
    let dataPoints = []
    for (let date in history) {
      let data = history[date]

      let change1H = this.dicToValueArray(data.change1h)
      let change7H = this.dicToValueArray(data.change7h)
      let change7D = this.dicToValueArray(data.change7d)

      let marketCap = this.dicToValueArray(data.marketCap)

      // let price = this.dicToValueArray(data.price)
      let price = [new ExchangeValuePoint('usd', data.price.usd)]

      let volume24H = this.dicToValueArray(data.volume24)

      let timestamp = data.timestamp

      let dataPoint = new ExchangeDataPoint(timestamp,
                          price,
                          marketCap,
                          volume24H,
                          change1H,
                          change7H,
                          change7D)

      dataPoints.push(dataPoint)
    }
    let historicalData = new TokenHistoricData(token, dataPoints)

    callback(historicalData)
  }

  dicToValueArray (dic) {
    let ret = []
    for (let key in dic) {
      let value = dic[key]
      ret.push(new ExchangeValuePoint(key, value))
    }

    return ret
  }

  fetchRaw (token, callback) {
    var historyData = null

    Networker
     .instance()
     .start(CoinmarketcapGetTask.fetchRawTask(token))
      .then((data) => {
        callback(data)
        // historyData = data

        //   // getch current balance of token and append it
        //   // https://min-api.cryptocompare.com/data/price?fsym=MLN&tsyms=USD
        //   Networker
        //     .instance()
        //     .start(CoinmarketcapGetTask.fetchCurrentBalanceTask(token))
        //     .then((data) => {
        //       let lastHistoricalDataPoint = historyData.history[historyData.history.length - 1]
        //       let lastDataPointDate = new Date(lastHistoricalDataPoint.time * 1000)
        //       let currentDate = new Date()
        //       let sameDay = lastDataPointDate.getYear() === currentDate.getYear() &&
        //               lastDataPointDate.getMonth() === currentDate.getMonth() &&
        //               lastDataPointDate.getDate() === currentDate.getDate()

        //       if (sameDay) {
        //         historyData.history[historyData.history.length - 1].marketCap = data.marketCap
        //       } else {
        //         historyData.history[new Date().getTime() / 1000] = data
        //       }
        //     })
        //     .catch((error) => {
        //       console.error(error)
        //       // alert("Some problems with the account, try again later");
        //     })
      })
      .catch((error) => {
        console.error(error)
        // alert("Some problems with the account, try again later");
      })
  }
}

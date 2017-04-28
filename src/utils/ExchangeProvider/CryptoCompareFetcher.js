import { ExchangeDataFetcherBase } from './ExchangeDataFetcherBase'
import { ExchangeValuePoint, ExchangeDataPoint, TokenHistoricData } from './ExchangeProvider'
import { Networker } from '../Networking/Networker'
import { CryptoCompareGetTask } from './CryptoCompareGetTask'

export default class CryptoCompareFetcher extends ExchangeDataFetcherBase {
  fetch (token, callback, errorCallBack) {
    let parentObj = this
    this.fetchRaw(token, function (raw, error) {
      parentObj.parseRaw(token, raw, callback)
    })
  }

  fetchRaw (token, callback) {
    var historyData = null

    Networker
     .instance()
     .start(CryptoCompareGetTask.fetchRawTask(token))
      .then((data) => {
        if (data.Response === 'Success') {
          historyData = data.Data

          // getch current balance of token and append it
          Networker
          .instance()
          .start(CryptoCompareGetTask.fetchCurrentBalanceTask(token))
          .then((data) => {

              // replace or add the updated pricing
              let lastHistoricalDataPoint = historyData[historyData.length - 1]
              let lastDataPointDate = new Date(lastHistoricalDataPoint.time * 1000)
              let currentDate = new Date()
              let sameDay = lastDataPointDate.getYear() === currentDate.getYear() &&
                      lastDataPointDate.getMonth() === currentDate.getMonth() &&
                      lastDataPointDate.getDate() === currentDate.getDate()

              if (sameDay) {
                historyData[historyData.length - 1].close = data['USD']
              } else {
                historyData.push({
                  'close': data['USD'],
                  'high': data['USD'],
                  'low': data['USD'],
                  'time': new Date().getTime() / 1000
                })
              }

              callback(historyData, data)
          })
          .catch((error) => {
            console.error(error)
            // alert("Some problems with the account, try again later");
          })
        } else {
          callback(null, data)
        }
      })
      .catch((error) => {
        console.error(error)
        // alert("Some problems with the account, try again later");
      })
  }

  parseRaw (token, raw, callback) {
    if (!raw) {
      callback(new TokenHistoricData(token, []))
      return
    };

    let history = raw
    let dataPoints = []

    for (var i = 0; i < history.length; i++) {
      let data = history[i]

      let change1H = null// this.dicToValueArray(data.change1h);
      let change7H = null// this.dicToValueArray(data.change7h);
      let change7D = null// this.dicToValueArray(data.change7d);

      let marketCap = null// this.dicToValueArray(data.marketCap);

      let price = [new ExchangeValuePoint('usd', data.close)]

      let volume24H = null// this.dicToValueArray(data.volume24);

      let timestamp = data.time

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
}

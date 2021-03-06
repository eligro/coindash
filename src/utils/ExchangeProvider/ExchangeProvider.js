
import CryptoCompareFetcher from './CryptoCompareFetcher'
import BigNumber from 'bignumber.js'

export class ExchangeValuePoint {
  constructor (currency, value) {
    this.currency = currency
    this.value = value
  }
}

export class ExchangeDataPoint {
  constructor (timestamp, price, marketCap, volume24H, change1H, change7H, change7D) {
    this.timestamp = timestamp
    this.price = price
    this.marketCap = marketCap
    this.volume24H = volume24H
    this.change1H = change1H
    this.change7H = change7H
    this.change7D = change7D
  }

  priceForCurrency (currency) {
    return this.valueForKey(this.price, currency)
  }

  volumeForCurrency (currency) {
    return this.valueForKey(this.volume24H, currency)
  }

  capForCurrency (currency) {
    return this.valueForKey(this.marketCap, currency)
  }

  valueForKey (array, currency) {
    for (var p in array) {
      if (p.currency === currency) {
        return p.value
      }
    }

    return null
  }
}

export class TokenHistoricData {
  constructor (token, dataPoints) {
    this.token = token
    this.dataPoints = dataPoints.sort(this.sortByData)
  }

  sortByData (a, b) {
    if (a.timestamp < b.timestamp) return -1
    if (a.timestamp > b.timestamp) return 1

    return 0
  }
}

export const FiatUSD = 'USD'
export const BTC = 'BTC'
export const ETH = 'ETH'

export class ExchangeProvider {
  static instance () {
    // return new ExchangeProvider(new CoinMarketCapFetcher());
    return new ExchangeProvider(new CryptoCompareFetcher())
  }

  constructor (fetcher) {
    this.fetcher = fetcher
    this.cachedData = {}
  }

// API
  /*
    giving a days array, will calculate the fiat daily value of token balances
  */
  valueForDays (days, callback) {
    this.aggregateDays(days, 0, callback)
  }

  getBalances (tokens, callback) {
    let timestamp = new Date() / 1000
    this.aggregateBalances(timestamp, 'usd', tokens, 0, [], callback)
  }

  /*
    given a token, this will return a day by day token price data
  */
  getTokenDayStatus (token, currency, fromDate, callback) {
    let days = []
    let dayTime = 24 * 60 * 60

// prepare days array
    let endOfToday = new Date()
    endOfToday.setHours(23) // set hours to 0
    endOfToday.setMinutes(59) // set minutes to 0
    endOfToday.setSeconds(59) // set seconds to 0
    let currentUnix = Math.floor(endOfToday / 1000)
    while (currentUnix > fromDate) {
      days.push({
        'timestamp': currentUnix,
        'delta': 0,
        'aggregatedDelta': 1, // 1 simulates investing $1 and see its aggregated delta value
        'valuePoint': null,
        'fiatPrice': 0
      })
      currentUnix -= dayTime
    }

    this.fetchHistoricalDataForToken(token, function (historicalData) {
// get delta
      for (let idx in days) {
        let day = days[idx]
        let dayTime = day.timestamp

        let targetDate = new Date(dayTime * 1000)

        let isSameDate = function (dataPoint) {
          let d1 = new Date(dataPoint.timestamp * 1000)
          return d1.getYear() === targetDate.getYear() &&
                d1.getMonth() === targetDate.getMonth() &&
                d1.getDate() === targetDate.getDate()
        }
        let dataPoint = historicalData.dataPoints.find(isSameDate)

        if (dataPoint === undefined) { // no data point
          console.log('no data point for ' + token.symbol + ' at ' + targetDate)

          dataPoint = new ExchangeDataPoint(
              dayTime,
              [new ExchangeValuePoint('usd', token.ico_initial_price_usd)]
              , null, null, null, null, null
            )
        }

        let isSameCurrensy = function (exchangeValuePoint) {
          return exchangeValuePoint.currency.toUpperCase() === currency.toUpperCase()
        }

        day.valuePoint = dataPoint.price.find(isSameCurrensy)

        // check value is not 0, default to ico initial price
        if (day.valuePoint.value === 0) {
          day.valuePoint.value = token.ico_initial_price_usd
        }

        day.fiatPrice = day.valuePoint.value
      }

// calc delta
      let baseScale = days[days.length - 1].fiatPrice
      for (let dayIdx = days.length - 1; dayIdx >= 0; dayIdx--) {
        let day = days[dayIdx]

        if (dayIdx > 0) {
          let nextDay = days[dayIdx - 1]
// calc deposits and withdrawals

          day.delta = (nextDay.fiatPrice / day.fiatPrice) - 1
        }

        day.aggregatedDelta = day.fiatPrice / baseScale
      }
      callback(days)
    }, function (error) {
      console.log('token without history')
      callback(days, error)
    })
  }

// Utils
  /*
    giving a list of tokens and timestamp, find usd value of balances for every token.
  */
  aggregateBalances (timestamp, targetCurrency, tokens, idx, data, callback) {
    if (tokens.length === idx) {
      callback(data)
      return
    }

    let token = tokens[idx]
    let parentObj = this

    this.fetchHistoricalDataForToken(token, function (historicalData) {
      let targetDate = new Date(timestamp * 1000)

      var isSameDate = function (dataPoint) {
        let d1 = new Date(dataPoint.timestamp * 1000)
        return d1.getYear() === targetDate.getYear() &&
              d1.getMonth() === targetDate.getMonth() &&
              d1.getDate() === targetDate.getDate()
      }
      var dataPoint = historicalData.dataPoints.find(isSameDate)

      if (dataPoint === undefined) { // no data point
        // console.log('no data point')
        // data.push({
        //   'token': token,
        //   'balance': token.ico_initial_price_usd,
        //   'currency': 'usd'
        // })
        // parentObj.aggregateBalances(timestamp, targetCurrency, tokens, idx + 1, data, callback)
        // return

        console.log('no data point for ' + token.symbol + ' at ' + targetDate)
        dataPoint = new ExchangeDataPoint(
              timestamp,
              [new ExchangeValuePoint('usd', token.ico_initial_price_usd)]
              , null, null, null, null, null
            )
      }

      var isSameCurrensy = function (exchangeValuePoint) {
        return exchangeValuePoint.currency.toUpperCase() === targetCurrency.toUpperCase()
      }
      var exchangeValuePoint = dataPoint.price.find(isSameCurrensy)

      if (exchangeValuePoint == null) {
        exchangeValuePoint = new ExchangeValuePoint(targetCurrency, 0);
      }

      // check value is not 0, default to ico initial price
      if (exchangeValuePoint.value == 0) {
        exchangeValuePoint.value = token.ico_initial_price_usd
      }

      let currentValue = token.balance === 0 ? 0 : token.balance.times(exchangeValuePoint.value).toNumber()
      data.push({
        'token': token,
        'balance': currentValue,
        'currency': 'usd'
      })
      parentObj.aggregateBalances(timestamp, targetCurrency, tokens, idx + 1, data, callback)
    }, function (error) {
      console.log('token without history, defaulting to ico initial value', error)

      let exchangeValuePoint = new ExchangeValuePoint('usd', token.ico_initial_price_usd)
      let currentValue = token.balance === 0 ? 0 : token.balance.times(exchangeValuePoint.value).toNumber()

      data.push({
        'token': token,
        'balance': currentValue,
        'currency': 'usd'
      })
      parentObj.aggregateBalances(timestamp, targetCurrency, tokens, idx + 1, data, callback)
    })
  }

  aggregateDays (days, idx, callback) {
    if (days.length === idx) {
      callback(days)
    } else {
      var currentDay = days[idx]
      let parentObj = this

      this.valueForDay(currentDay, 'usd', function (value) {
        currentDay['dayFiatValue'] = value

        parentObj.valueForDaysDeposits(currentDay, 'usd', function (value) {
          currentDay['depositsFiatValue'] = value

          parentObj.valueForDaysWithdrawals(currentDay, 'usd', function (value) {
            currentDay['withdrawalsFiatValue'] = value

            return parentObj.aggregateDays(days, idx + 1, callback)
          })
        })
      })
    }
  }

  valueForDay (day, targetCurrency, callback) {
    this.aggregateTokens(day.balances, day.timestamp, 0, 0, targetCurrency, callback)
  }

  valueForDaysDeposits (day, targetCurrency, callback) {
    let allTokens = []
    for (let i in day.deposits) {
      let deposit = day.deposits[i]
      let depoToken = deposit.token

      let exists = function (token) {
        return depoToken.symbol === token.symbol
      }
      let t = allTokens.find(exists)
      if (t === null || t === undefined) {
        let t = depoToken.copy()
        t.balance = new BigNumber(deposit.amount)
        allTokens.push(t)
      } else {
        t.addToBalance(new BigNumber(deposit.amount))
      }
    }
    this.aggregateTokens(allTokens, day.timestamp, 0, 0, targetCurrency, callback)
  }

  valueForDaysWithdrawals (day, targetCurrency, callback) {
    let allTokens = []
    for (let i in day.withdrawals) {
      let deposit = day.withdrawals[i]
      let depoToken = deposit.token

      let exists = function (token) {
        return depoToken.symbol === token.symbol
      }
      let t = allTokens.find(exists)
      if (t === null || t === undefined) {
        let t = depoToken.copy()
        t.balance = new BigNumber(deposit.amount)
        allTokens.push(t)
      } else {
        t.addToBalance(new BigNumber(deposit.amount))
      }
    }

    this.aggregateTokens(allTokens, day.timestamp, 0, 0, targetCurrency, callback)
  }

  aggregateTokens (tokens, timestamp, count, totalValue, targetCurrency, callback) {
    if (tokens.length === count) {
      callback(totalValue)
      return
    }

// //TODO: handle unseporrted tokens
// if (tokens[count].symbol === "MKR" || tokens[count].symbol === "???? Unicorn" || tokens[count].symbol === "???? BeerCoin" || tokens[count].symbol === "HKG" || tokens[count].symbol === "GNT (Golem)") {
// console.log("token without history - hard coded");
// console.log(tokens[count].symbol);
// return this.aggregateTokens(tokens, timestamp, ++count, totalValue, targetCurrency, callback);
// }

    let parentObj = this

    this.fetchHistoricalDataForToken(tokens[count], function (historicalData) {
      let targetDate = new Date(timestamp * 1000)

      var isSameDate = function (dataPoint) {
        let d1 = new Date(dataPoint.timestamp * 1000)
        return d1.getYear() === targetDate.getYear() &&
              d1.getMonth() === targetDate.getMonth() &&
              d1.getDate() === targetDate.getDate()
      }
      var dataPoint = historicalData.dataPoints.find(isSameDate)

      if (dataPoint === undefined) { // no data point
        console.log('no data point for ' + tokens[count].symbol + ' at ' + targetDate)
        dataPoint = new ExchangeDataPoint(
              timestamp,
              [new ExchangeValuePoint('usd', tokens[count].ico_initial_price_usd)]
              , null, null, null, null, null
            )
      }

      var isSameCurrensy = function (exchangeValuePoint) {
        return exchangeValuePoint.currency.toUpperCase() === targetCurrency.toUpperCase()
      }
      var exchangeValuePoint = dataPoint.price.find(isSameCurrensy)

      console.log("start");

      if (exchangeValuePoint == null || exchangeValuePoint == undefined) {
        exchangeValuePoint = new ExchangeValuePoint(targetCurrency, 0);
      }

      // check value is not 0, default to ico initial price
      if (exchangeValuePoint.value == 0) {
        exchangeValuePoint.value = tokens[count].ico_initial_price_usd
      }

      let currentValue = tokens[count].balance === 0 ? 0 : tokens[count].balance.times(exchangeValuePoint.value).toNumber()
      tokens[count].fiatCurrency = targetCurrency
      tokens[count].fiatValue = currentValue

      return parentObj.aggregateTokens(tokens, timestamp, ++count, totalValue + currentValue, targetCurrency, callback)
    }, function (error) {
      console.log('token without history', error)
      return this.aggregateTokens(tokens, timestamp, ++count, totalValue, targetCurrency, callback)
    })
  }

  fetchHistoricalDataForToken (token, callback, errorCallBack) {
    let cached = this.cachedData[token.symbol]
    if (!cached) {
      let parentObj = this
      this.fetcher.fetch(token, function (historicalData) {
        parentObj.cachedData[token.symbol] = historicalData
        callback(historicalData)
      }, errorCallBack)
    } else {
      callback(cached)
    }
  }
}

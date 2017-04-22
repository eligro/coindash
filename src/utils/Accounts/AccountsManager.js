import { ETHWallet } from './Ethereum/ETHWallet'
import { PoloniexAccount } from './Poloniex/PoloniexAccount'
import { AccountsBalanceUtils } from './AccountsBalanceUtils'
import { AccountsTradesUtils } from './AccountsTradesUtils'
import { AccountsDepositAndWithdrawalUtils } from './AccountsDepositAndWithdrawalUtils'
import { AccountsCalcUtils } from './AccountsCalcUtils'
import { Token } from '../../utils/Trades/Token'
import { ExchangeProvider } from '../../utils/ExchangeProvider/ExchangeProvider'
import analytics from '../../components/analytics'
import { Networker } from '../Networking/Networker'

const nevent = ({action, label, nonInteraction = true}) => analytics.event({ category: 'Account', action, label, nonInteraction })

export class AccountsManager {
  static hardcodedManager () {
    let wallet = ETHWallet.hardcoded()
    let accounts = wallet.getAccounts()
    let poloniexAccount = new PoloniexAccount(
        '6R25SW6B-OCHTH66W-VONNICW7-72GYFIJB',
        '2ffccecbae9bfcf3c330c27eff9de6f82260def1b1165bd61ff4b92857cd2d21ea99f8860b22d7fbed496c9a36edd546265c41d2ae1c98c613746f035548a0f4'
      )
    accounts.push(poloniexAccount)

    return new AccountsManager(accounts)
  }

  constructor (accounts) {
    this.accounts = accounts
  }

  // API
  getBalances (callback) {
    nevent({action: 'Get Balances', label: 'Start'})
    AccountsBalanceUtils.fetchBalances(this.accounts, function (data) {
      let exchangeProvider = ExchangeProvider.instance()
      exchangeProvider.getBalances(data, function (balances) {
        // prepare for standard objects
        let ret = []
        for (let i in balances) {
          let obj = balances[i]
          let token = obj.token
          let fiatValue = obj.balance
          let cryptoAmount = token.balance.toNumber()

          ret.push({
            'title': token.symbol,
            'amount': cryptoAmount,
            'value': fiatValue
          })
        }

        nevent({action: 'Get Balances', label: 'Balances received'})

        callback(ret)
      })
    })
  }

  dayStatusFromDate (fromDate, statusUpdater, callback) {
    let executed = 0
    let executions = 3

    let balances = null
    let trades = null
    let deposits = null
    let withdrawals = null

    let parentObj = this

    // set updater
    Networker
    .instance()
    .startNewTaskSequence()
    .setProgressCallback(function (obj) {
      statusUpdater(obj)
    })

    console.time('fetchBalances')
    nevent({action: 'Days Status', label: 'Start'})
    AccountsBalanceUtils.fetchBalances(this.accounts, function (data) {
      if (!data.length) { callback(null) }
      balances = data

      executed += 1

      console.timeEnd('fetchBalances')
      console.log('finsihed fetchBalances')
      nevent({action: 'Days Status', label: 'Fetched Balances'})
      // statusUpdater(executed * 10 + '%')

      if (executed === executions) {
        parentObj.calcDayStatusObject(fromDate, balances, trades, deposits, withdrawals, statusUpdater, callback)
      }
    })

    console.time('fetchTrades')
    AccountsTradesUtils.fetchTrades(this.accounts, function (data) {
      trades = data

      executed += 1

      console.timeEnd('fetchTrades')
      console.log('finsihed fetchTrades')
      nevent({action: 'Days Status', label: 'Fetched Trades'})
      // statusUpdater(executed * 10 + '%')

      if (executed === executions) {
        parentObj.calcDayStatusObject(fromDate, balances, trades, deposits, withdrawals, statusUpdater, callback)
      }
    })

    console.time('AccountsDepositAndWithdrawalUtils')
    AccountsDepositAndWithdrawalUtils.fetch(this.accounts, function (openWithdrawals, openDeposits) {
      deposits = openDeposits
      withdrawals = openWithdrawals

      executed += 1

      console.timeEnd('AccountsDepositAndWithdrawalUtils')
      console.log('finsihed AccountsDepositAndWithdrawalUtils')
      nevent({action: 'Days Status', label: 'Fetched Deposits and Widthdraws'})
      // statusUpdater(executed * 10 + '%')

      if (executed === executions) {
        parentObj.calcDayStatusObject(fromDate, balances, trades, deposits, withdrawals, statusUpdater, callback)
      }
    })
  }

  // UTILS
  calcDayStatusObject (fromDate, currentBalances, trades, deposits, withdrawals, statusUpdater, callback) {
    let days = []
    let dayTime = 24 * 60 * 60

    // prepare days array
    let endOfToday = new Date()
    endOfToday.setHours(23)   // set hours to 0
    endOfToday.setMinutes(59) // set minutes to 0
    endOfToday.setSeconds(59) // set seconds to 0
    let currentUnix = Math.floor(endOfToday / 1000)
    while (currentUnix > fromDate) {
      days.push({
        'timestamp': currentUnix,
        'trades': [],
        'deposits': [],
        'withdrawals': [],
        'balances': [],
        'delta': 0,
        'aggregatedDelta': 1 // 1 simulates investing $1 and see its aggregated delta value
      })
      currentUnix -= dayTime
    }

    // today has the current balance
    console.log(currentBalances)
    days[0].balances = currentBalances

    // append trades, open deposits and withdrawals
    console.log('ordered day events')
    // statusUpdater('40%')

    for (let dayIdx in days) {
      let day = days[dayIdx]

      // trades
      for (let tradeIdx in trades) {
        let trade = trades[tradeIdx]

        if (trade.timestamp < (day.timestamp - dayTime)) break

        if (trade.timestamp <= day.timestamp) {
          day.trades.push(trade)
        }
      }

      // deposits
      for (let depositIdx in deposits) {
        let deposit = deposits[depositIdx]

        if (deposit.timestamp <= day.timestamp && deposit.timestamp > (day.timestamp - dayTime)) {
          day.deposits.push(deposit)
        }
      }

      // withdrawals
      for (let withdIdx in withdrawals) {
        let withdrawal = withdrawals[withdIdx]

        if (withdrawal.timestamp <= day.timestamp && withdrawal.timestamp > (day.timestamp - dayTime)) {
          day.withdrawals.push(withdrawal)
        }
      }
    }
    console.log('ordered day data')
    // statusUpdater('50%')

    // calc balances
    days = AccountsCalcUtils.calcBalances(days)

    console.log('calculated balances')
    // statusUpdater('70%')

    let exchangeProvider = ExchangeProvider.instance()
    exchangeProvider.valueForDays(days, function (daysValues) {
      console.log('calculated USD daily value')
      // statusUpdater('100%')

      let ret = {
        'portfolio': AccountsCalcUtils.calcDayStats(daysValues)
      }

      exchangeProvider.getTokenDayStatus(Token.ETH(), 'usd', fromDate, function (data) {
        ret['market'] = data

        callback(ret)
      })
    })
  }

  calcDeltaByDays (data, numOfDays, callback) {
    console.log('calcDeltaByDays')

    let startBalance = data.portfolio.length > numOfDays
      ? data.portfolio[data.portfolio.length - numOfDays].dayFiatValue
      : data.portfolio[0].dayFiatValue

    let endBalance = data.portfolio[data.portfolio.length - 1].dayFiatValue
    callback((endBalance - startBalance) / startBalance)
  }
}

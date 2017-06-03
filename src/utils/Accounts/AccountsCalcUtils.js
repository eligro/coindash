import { Trade } from '../../utils/Trades/Trade'
import { Token } from '../../utils/Trades/Token'
import BigNumber from 'bignumber.js'

export class AccountsCalcUtils {
  static calcDayStats (days) {
    /**
      *  We calculate day delta this way:
      *  (next day USD value) - ((day value) + deposits - withdrawals)
      *
      * We calculate variance and covariance
    */
    days[days.length - 1].delta = 0
    days[days.length - 1].aggregatedDelta = 1
    for (let dayIdx = days.length - 2; dayIdx >= 0; dayIdx--) {
      let day = days[dayIdx]
      let previousDay = days[dayIdx + 1]

      /*
        In case the previous day fiat value is 0 it means there is no balance so we can't really calculate an
        aggregated value.
      */
      if (previousDay.dayFiatValue == 0) {
        day.delta = 0;
        day.aggregatedDelta = 1;
        continue;
      }

      // the corrected value is considering the day's balances amount adjuted for the deposits and withdrawals
      // let previousDayCorrectedValue = previousDay.dayFiatValue + previousDay.withdrawalsFiatValue - previousDay.depositsFiatValue;
      let todayCorrectedValue = day.dayFiatValue - day.depositsFiatValue + day.withdrawalsFiatValue

      // we do not want to the nominator to be 0 and divide it so just set to 0
      if (todayCorrectedValue - previousDay.dayFiatValue === 0) {
        day.delta = 0
      } else {
        day.delta = (todayCorrectedValue - previousDay.dayFiatValue) / previousDay.dayFiatValue
      }

      // if for some reason the previous day's aggregated delta is 0 it will make
      // an infinite loop where all days will have 0 as aggregated delta.
      if (previousDay.aggregatedDelta === 0) {
        day.aggregatedDelta = day.delta
      } else {
        day.aggregatedDelta = previousDay.aggregatedDelta * (1 + day.delta)
      }
    }

    return days
  }

  /*
    Given a list of days with deposits, withdrawals and the current balance.
    This will calculate the balance of previous days.
  */
  static calcBalances (days) {
    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
      if (dayIdx + 1 >= days.length) break

      let day = days[dayIdx]
      let previousDay = days[dayIdx + 1]
      let balancesCpy = AccountsCalcUtils.copyTokenList(day.balances)

      // trades
      for (let tradeIdx in day.trades) {
        let trade = day.trades[tradeIdx]

        let lhsTokenFromBalances = AccountsCalcUtils.tokenFromList(balancesCpy, trade.lhsToken)
        let rhsTokenFromBalances = AccountsCalcUtils.tokenFromList(balancesCpy, trade.rhsToken)

        /*  IN CASE LHS/ RHS TOKEN IS NOT IN balancesCpy
            in this case we add the tokn to balancesCpy which will be set as the
            balance list for dayIdx + 1 (the preivous day)
        */

        if (trade.type === Trade.Types().Buy) { // buy
          if (lhsTokenFromBalances == null) {
            lhsTokenFromBalances = Token.fromSymbol(trade.lhsToken.symbol)
            // token balance will be 0 since we bought using all the balance
            balancesCpy.push(lhsTokenFromBalances)
          }
          if (rhsTokenFromBalances == null) {
            rhsTokenFromBalances = Token.fromSymbol(trade.rhsToken.symbol)
            rhsTokenFromBalances.balance = new BigNumber(trade.rhsValue)
            balancesCpy.push(rhsTokenFromBalances)
          }

          if (trade.source === Trade.Source().ETH_Blockchain) { // ICO buyin
            rhsTokenFromBalances.balance = new BigNumber(0) // TODO - we need a better way to calculate how much to take off
            lhsTokenFromBalances.addToBalance(new BigNumber(trade.lhsValue))
          } else {
            lhsTokenFromBalances.addToBalance(new BigNumber(trade.lhsValue))
            rhsTokenFromBalances.reduceFromBalance(new BigNumber(trade.rhsValue))
          }
        } else { // sell
          if (lhsTokenFromBalances == null) {
            lhsTokenFromBalances = Token.fromSymbol(trade.lhsToken.symbol)
            lhsTokenFromBalances.balance = new BigNumber(trade.lhsValue)
            balancesCpy.push(lhsTokenFromBalances)
          }
          if (rhsTokenFromBalances == null) {
            rhsTokenFromBalances = Token.fromSymbol(trade.rhsToken.symbol)
            // balance will be 0 since we sold all the balance
            balancesCpy.push(rhsTokenFromBalances)
          }

          lhsTokenFromBalances.reduceFromBalance(new BigNumber(trade.lhsValue))
          rhsTokenFromBalances.addToBalance(new BigNumber(trade.rhsValue))
        }
      }

      // deposits
      for (let depoIdx in day.deposits) {
        let deposit = day.deposits[depoIdx]

        let token = AccountsCalcUtils.tokenFromList(balancesCpy, deposit.token)
        if (token == null) {
          // a deposited token not found? don't see how this is possible but will leave it for now here
          token = Token.fromSymbol(deposit.token.symbol)
          balancesCpy.push(token) // if we did not have it before, add it with balance 0

          let tmpToken = Token.fromSymbol(deposit.token.symbol)
          tmpToken.balance = new BigNumber(deposit.amount)
        } else {
          token.reduceFromBalance(new BigNumber(deposit.amount))
        }
      }

      // withdrawals
      for (let withIdx in day.withdrawals) {
        let withr = day.withdrawals[withIdx]

        let token = AccountsCalcUtils.tokenFromList(balancesCpy, withr.token)
        if (token == null) {
          // if the withdrawan token is not in the balance list it means it was withdrawan entirely
          // so we add it to the previous day's balances
          token = Token.fromSymbol(withr.token.symbol)
          token.balance = new BigNumber(withr.amount)
          balancesCpy.push(token)
        } else {
          token.addToBalance(new BigNumber(withr.amount))
        }
      }

      previousDay.balances = balancesCpy
    }

    return days
  }

  static copyTokenList (lst) {
    let ret = []
    for (let i in lst) {
      let t = lst[i]
      ret.push(t.copy())
    }
    return ret
  }

  static tokenFromList (lst, searchedToken) {
    for (let i in lst) {
      let t = lst[i]
      if (t.symbol === searchedToken.symbol) {
        return t
      }
    }
    return null
  }
}

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

      // the corrected value is considering the day's balances amount adjuted for the deposits and withdrawals
      // let previousDayCorrectedValue = previousDay.dayFiatValue + previousDay.withdrawalsFiatValue - previousDay.depositsFiatValue;
      let todayCorrectedValue = day.dayFiatValue - day.depositsFiatValue + day.withdrawalsFiatValue
      day.delta = (todayCorrectedValue - previousDay.dayFiatValue) / previousDay.dayFiatValue

      day.aggregatedDelta = previousDay.aggregatedDelta * (1 + day.delta)
    }

    // let baseScale = days[days.length - 1].dayFiatValue;
    // for(let dayIdx = days.length - 1; dayIdx >= 0; dayIdx--) {
    //   let day = days[dayIdx];
    //   let nextDay = days[dayIdx - 1];

    //   if (dayIdx > 0) {
    //     // the corrected value is considering the day's balances amount adjuted for the deposits and withdrawals
    //     let nextDayCorrectedValue = nextDay.dayFiatValue + nextDay.withdrawalsFiatValue - nextDay.depositsFiatValue;
    //     let todayCorrectedValue = day.dayFiatValue - day.depositsFiatValue + day.withdrawalsFiatValue;
    //     // let diff = nextDay.dayFiatValue - (day.dayFiatValue - day.depositsFiatValue + day.withdrawalsFiatValue);
    //     day.delta = (nextDayCorrectedValue - todayCorrectedValue) / todayCorrectedValue;

    //   }

    //   day.aggregatedDelta = day.dayFiatValue / baseScale;
    // }

    return days
  }

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

        if (trade.type === Trade.Types().Buy) { // buy
          if (lhsTokenFromBalances == null) {
            lhsTokenFromBalances = Token.fromSymbol(trade.lhsToken.symbol)
            balancesCpy.push(lhsTokenFromBalances)
          }
          if (rhsTokenFromBalances == null) {
            rhsTokenFromBalances = Token.fromSymbol(trade.rhsToken.symbol)
            rhsTokenFromBalances.balance = new BigNumber(trade.rhsValue)
            balancesCpy.push(rhsTokenFromBalances)

            /*
              the rhs token is the one bought using the lhs token.
              If there is no token on the list for whatever reason we add it because from
              this day forward it should be on the list
            */
            AccountsCalcUtils.addTokenToAllOlderBalances(
              rhsTokenFromBalances,
              dayIdx,
              days)
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

            /*
              the lhs token is the one sold to using the rhs token.
              If there is no token on the list for whatever reason we add it because from
              this day forward it should be on the list
            */
            AccountsCalcUtils.addTokenToAllOlderBalances(
              lhsTokenFromBalances,
              dayIdx,
              days)
          }
          if (rhsTokenFromBalances == null) {
            rhsTokenFromBalances = Token.fromSymbol(trade.rhsToken.symbol)
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
          token = Token.fromSymbol(deposit.token.symbol)
          balancesCpy.push(token) // if we did not have it before, add it with balance 0

          let tmpToken = Token.fromSymbol(deposit.token.symbol)
          tmpToken.balance = new BigNumber(deposit.amount)

          /*
            Deposited tokens which are not on the list should be added from this day forward
          */
          AccountsCalcUtils.addTokenToAllOlderBalances(
              tmpToken,
              dayIdx,
              days)
        } else {
          token.reduceFromBalance(new BigNumber(deposit.amount))
        }
      }

      // withdrawals
      for (let withIdx in day.withdrawals) {
        let withr = day.withdrawals[withIdx]

        let token = AccountsCalcUtils.tokenFromList(balancesCpy, withr.token)
        if (token == null) {
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

  static addTokenToAllOlderBalances (token, idxDay, days) {
    for (let i = idxDay - 1; i >= 0; i--) {
      let day = days[i]
      let balancesCpy = AccountsCalcUtils.copyTokenList(day.balances)
      balancesCpy.push(token)

      day.balances = balancesCpy
    }
  }
}

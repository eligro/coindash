import { Utils } from '../../utils/utils/Utils'
import { WithdrawlDeposit } from '../../utils/Trades/WithdrawlDeposit'

export class AccountsDepositAndWithdrawalUtils {
  // static fetchOpenWithdrawlsAndDeposits(accounts, callback) {
  //   AccountsDepositAndWithdrawalUtils.fetchWithdrawlsAndDeposits(accounts, function(withdrawals, deposits) {

  //         // filter open
  //         let openDeposits = [];
  //         for (let idx in deposits) {
  //           let deposit = deposits[idx];
  //           if (deposit.counterpart == null) {
  //             openDeposits.push(deposit);
  //           }
  //         }
  //         openDeposits = Utils.sortTrades(openDeposits);

  //         let openWithdrawals = [];
  //         for (let idx in withdrawals) {
  //           let withdrawal = withdrawals[idx];
  //           if (withdrawal.counterpart == null) {
  //             openWithdrawals.push(withdrawal);
  //           }
  //         }
  //         openWithdrawals = Utils.sortTrades(openWithdrawals);

  //         callback(openWithdrawals, openDeposits);

  //   });
  // }

  // static fetchWithdrawlsAndDeposits(accounts, callback) {
  //   AccountsDepositAndWithdrawalUtils.fetchWithdrawAndDepositHistoryForAccount(accounts, 0, {}, function(data) {
  //     let concat = Utils.concatArrayOfArrays(data);

  //         // seperate in deposits and withdrawals
  //         let deposits = [];
  //         let withdrawals = [];
  //         for (let i in concat) {
  //           let dw = concat[i];
  //           if (dw.type === WithdrawlDeposit.Types().Deposit) {
  //             deposits.push(dw);
  //           }
  //           else {
  //             withdrawals.push(dw);
  //           }
  //         }

  //         // find counterparts
  //         for (let idxDep in deposits) {
  //           let deposit = deposits[idxDep];

  //           for (let idxWith in withdrawals) {
  //             let withdrawal = withdrawals[idxWith];

  //             if (deposit.address === withdrawal.address &&
  //               Math.abs(deposit.timestamp - withdrawal.timestamp) < 3600 &&
  //               Math.abs(deposit.amount - withdrawal.amount) < 0.1 &&
  //               withdrawal.counterpart == null &&
  //               deposit.counterpart == null) {

  //               withdrawal.counterpart = deposit;
  //               deposit.counterpart = withdrawal;
  //               break;
  //             }
  //           }
  //         }

  //         callback(withdrawals, deposits);
  //   });
  // }

  static fetch (accounts, callback) {
    AccountsDepositAndWithdrawalUtils.fetchWithdrawAndDepositHistoryForAccount(accounts, 0, {}, function (data) {
      let concat = Utils.concatArrayOfArrays(data)

          // seperate in deposits and withdrawals
      let deposits = []
      let withdrawals = []
      for (let i in concat) {
        let dw = concat[i]
        if (dw.type === WithdrawlDeposit.Types().Deposit) {
          deposits.push(dw)
        } else {
          withdrawals.push(dw)
        }
      }
      callback(withdrawals, deposits)
    })
  }

  static fetchWithdrawAndDepositHistoryForAccount (accounts, idx, historyDic, callback) {
    if (idx === accounts.length) {
      callback(historyDic)
      return
    }

    let account = accounts[idx]

    account.getWithdrawAndDepositHistory(function (data) {
      historyDic[idx] = data

      AccountsDepositAndWithdrawalUtils.fetchWithdrawAndDepositHistoryForAccount(accounts, idx + 1, historyDic, callback)
    })
  }
}

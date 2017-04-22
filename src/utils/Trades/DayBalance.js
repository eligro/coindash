
export class DayBalance {
  constructor (date, balances) {
    this.date = date
    this.balances = balances
  }

  pretty () {
    let ret = this.date + ':\n'
    for (let i in this.balances) {
      let b = this.balances[i]
      ret += '  ' + b.symbol + ' - ' + b.prettyBalance() + '\n'
    }

    return ret
  }
}

import React, {PropTypes} from 'react'
import Spinner from '../../common/Spinner.react'
import Utils from '../../../utils/Utils'
import BalanceItem from './BalanceItem.react'

import './Balances.css'

class Balances extends React.Component {
  render () {
    const items = this.props.balances.map((item, index) => <BalanceItem key={index} item={item} />)

    const sum = this.props.balances.reduce(function (total, value) {
      return total + value.value
    }, 0)

    return (
      <div className='balances-list'>
        {!this.props.balances.length > 0 && !this.props.error && <Spinner />}
        {this.props.balances.length > 0 && items}
        {this.props.error && <div>{this.props.error}</div>}

        <div className='balance-item sum'>
          <div className='item-title'>Total</div>
          <div className='item-amount' />
          <div className='item-value' title={`$${sum}`}>${Utils.toFixed(sum, 3)}</div>
        </div>
      </div>
    )
  }
}

Balances.propTypes = {
  balances: PropTypes.array.isRequired
}

export default Balances

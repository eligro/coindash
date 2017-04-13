import React from 'react'
import Utils from '../../../utils/Utils'
import { Button, OverlayTrigger, Tooltip, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'

const toFixed = (num, len = 2) => parseFloat(Math.round(num * 100) / 100).toFixed(len)

class BalanceItem extends React.Component {
  render () {
    const tooltip = (
      <Tooltip id='tooltip'>Remove Token</Tooltip>
    )
    return (
      <div className='balance-item'>
        <div className='item-title'>
          <ButtonToolbar>
            <DropdownButton bsStyle='link' title={this.props.item.title}>
              <MenuItem eventKey='1'>Remove Token</MenuItem>
            </DropdownButton>
          </ButtonToolbar>
        </div>
        <div className='item-amount'>{toFixed(this.props.item.amount, 4)}</div>
        <div className='item-value' title={`$${this.props.item.value}`}>${Utils.toFixed(this.props.item.value, 3)}</div>
      </div>
    )
  }
}

export default BalanceItem

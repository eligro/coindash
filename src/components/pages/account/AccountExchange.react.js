import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import './AccountExchange.css'

class AccountExchange extends React.Component {
  render () {
    return (
      <div className='account-source'>
        <div className='source-type'>{this.props.exchange.type}</div>
        <div className='source-token ellipsis' title={this.props.exchange.token}>{this.props.exchange.token}</div>
        <div className='delete-btn'>
          <FontAwesome name='times' onClick={this.props.deleteExchangeCB} />
        </div>
      </div>
    )
  }
}

AccountExchange.propTypes = {
  exchange: PropTypes.object.isRequired
}

export default AccountExchange

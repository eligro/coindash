import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button } from 'react-bootstrap'
import * as exchangeActions from '../../../actions/exchange.actions'
import './AccountPage.css'
import AccountExchange from './AccountExchange.react'

import AccountModal from './AccountModal.react'

class AccountPage extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      exchange: {type: 'ethereum', token: '', secret: '', created: ''}, showModal: false
    }

        // this.titleChange = this.titleChange.bind(this);
    this.tokenChange = this.tokenChange.bind(this)
    this.createExchange = this.createExchange.bind(this)
    this.deleteExchange = this.deleteExchange.bind(this)

    this.tempFunc = this.tempFunc.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

    /* titleChange(event) {
        const exchange = this.state.exchange;
        exchange.title = event.target.value;
        this.setState({exchange: exchange});
    } */

  close () {
    this.setState({ showModal: false })
  }

  open (index) {
    this.setState({ showModal: true, index: index })
  }

  tokenChange (event) {
    const exchange = this.state.exchange
    exchange.token = event.target.value
    this.setState({exchange: exchange})
  }

  createExchange (event) {
        // console.log('saveExchange', this.state);
    this.props.actions.createExchange(this.state.exchange)
  }

  deleteExchange () {
    console.log('delete exchange', this.state.index)
    this.props.actions.deleteExchange(this.state.index)
  }

  exchangeComponent (exchange, index) {
    return <AccountExchange key={index} exchange={exchange} deleteExchangeCB={() => { this.open(index) }} />
        /* return(
            <div key={index}>
                <div>{exchange.type}</div>
                <div>{exchange.token}</div>
                <div className="delete-btn">
                    <FontAwesome name="times" onClick={() => { this.deleteExchange(index); } }/>
                </div>
            </div>
        ); */
  }

  tempFunc () {
  }

  render () {
    return (
      <div className='page-container account-page'>
        <div className='my-accounts'>
          <div className='page-title'>My Accounts</div>
          <AccountModal onSaveCB={this.createExchange} exchange={this.state.exchange} />
        </div>
        {this.props.exchanges.map(this.exchangeComponent, this)}

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>Delete Account?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
                        Are you sure that you want to delete the account?
                    </Modal.Body>

          <Modal.Footer>
            <Button bsStyle='primary' onClick={this.close}>No</Button>
            <Button bsStyle='primary' onClick={() => { this.deleteExchange(); this.close() }} >Yes</Button>
          </Modal.Footer>
        </Modal>
      </div>

    )
  }
}

AccountPage.propTypes = {
  exchanges: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps (state, ownProps) {
  return {
    exchanges: state.exchanges
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(exchangeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)

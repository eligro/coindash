import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import AccountExchangeForm from './AccountExchangeForm.react'
import './AccountModal.css'

class AccountModal extends React.Component {

  constructor (props, context) {
    super(props, context)

    this.state = {showModal: false}

    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  close () {
    this.setState({ showModal: false })
  }

  open () {
    this.setState({ showModal: true })
  }

  render () {
    return (
      <div onKeyPress={this.keyPress}>
        <div className='add-new-cont'>
          <Button bsStyle='primary' bsSize='large' onClick={this.open}>
                        Add new account
                    </Button>
        </div>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add new account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AccountExchangeForm exchange={this.props.exchange} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { this.props.onSaveCB(); this.close() }}>Save</Button>
            <Button onClick={this.close}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default AccountModal

import React from 'react'
import { FormGroup, ControlLabel, FormControl, Checkbox } from 'react-bootstrap'

class AddTokenForm extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = { token: this.props.token, checked: false }

    this.textboxChange = this.textboxChange.bind(this)
    this.addressChange = this.addressChange.bind(this)
    this.symbolChange = this.symbolChange.bind(this)
    this.decimalChange = this.decimalChange.bind(this)
    this.contractAddressChange = this.contractAddressChange.bind(this)
  }

  getAddressValidationState () {
    return 'success'
  }

  getSymbolValidationState () {
    return 'success'
  }

  getDecimalValidationState () {
    return 'success'
  }

  getContractValidationState () {
    return 'success'
  }

  onFormSubmit (event) {

  }

  textboxChange (event) {
    this.setState({checked: !this.state.checked})
  }

  addressChange (event) {
    const token = this.state.token
    token.address = event.target.value

    this.setState({token: token})
  }

  symbolChange (event) {
    const token = this.state.token
    token.symbol = event.target.value

    this.setState({token: token})
  }

  decimalChange (event) {
    const token = this.state.token
    token.decimal = event.target.value

    this.setState({token: token})
  }

  contractAddressChange (event) {
    const token = this.state.token
    token.ico_contract_address = event.target.value

    this.setState({token: token})
  }

  render () {
    var contractField
    if (this.state.checked) {
      contractField = <FormGroup controlId='formContract' validationState={this.getContractValidationState()}>
        <ControlLabel>ICO Contract Address</ControlLabel>
        <FormControl type='text'
          placeholder='Enter Valid ICO Contract Address'
          onChange={this.contractAddressChange} />
      </FormGroup>
    }
    return (
      <form onSubmit={this.onFormSubmit}>

        <FormGroup controlId='formAddress' validationState={this.getAddressValidationState()}>
          <ControlLabel>Address</ControlLabel>
          <FormControl type='text'
            placeholder='Enter Valid Address'
            onChange={this.addressChange} />
        </FormGroup>

        <FormGroup controlId='formSymbol' validationState={this.getSymbolValidationState()}>
          <ControlLabel>Symbol</ControlLabel>
          <FormControl type='text'
            placeholder='Enter Valid Symbol'
            onChange={this.symbolChange} />
        </FormGroup>

        <FormGroup controlId='formDecimal' validationState={this.getDecimalValidationState()}>
          <ControlLabel>Decimals</ControlLabel>
          <FormControl type='text'
            placeholder='Enter Decimals'
            onChange={this.decimalChange} />
        </FormGroup>

        <Checkbox checked={this.state.checked} onChange={this.textboxChange}>ICO Contract Address</Checkbox>
        {contractField}
      </form>
    )
  }
}

export default AddTokenForm

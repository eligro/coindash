import React from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap';

class AccountExchangeForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {exchange: this.props.exchange}; //{value: ''};

        this.handleTokenChange = this.handleTokenChange.bind(this);
        this.handleSecretChange = this.handleSecretChange.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }

    handleTokenChange(event) {
        const exchange = this.state.exchange;
        exchange.token = event.target.value;

        this.setState({exchange: exchange});
    }

    handleSecretChange(event) {
        const exchange = this.state.exchange;
        exchange.secret = event.target.value;

        this.setState({exchange: exchange});
    }

    getValidationState() {
        //const length = this.state.value.length;
        // const length = this.props.exchange.token.length;
        // if (length > 10) return 'success';
        // else if (length > 5) return 'warning';
        // else if (length > 0) return 'error';

        // var ethereum_address = require('ethereum-address');
        // console.log(this.props.exchange.token)
        // if (ethereum_address.isAddress(this.props.exchange.token)) {
        //     console.log('Valid ethereum address.');
            return 'success'
        // }
        // else {
        //     console.log('Invalid Ethereum address.');
        //     return 'error';
        // }
    }

    typeChange(event) {
        const exchange = this.state.exchange;
        exchange.type = event.target.value;

        this.setState({exchange: exchange});
    }

    keyPress(event) {
        /*console.log('keyPress', event, event.target.charCode);
        if(event.target.charCode === 13){
            console.log('Enter clicked!!!');
        }*/
    }

    onFormSubmit(event) {
        event.preventDefault();
    }

    getTokenLabel() {
        var res;
        let type = this.state.exchange.type;
        switch (type) {
            case 'polonix':
                res = 'Paste API key';
                break;
            case 'ethereum':
                res = 'Paste public key';
                break;
            default:
                res = 'Paste token';
        }

        return res;
    }

    render() {
        var partial = '';
        if (this.state.exchange.type == 'polonix') {
            partial = <FormGroup controlId="formSecret">
                <ControlLabel>Secret</ControlLabel>
                <FormControl type="text" value={this.props.exchange.secret}
                             placeholder="Enter secret"
                             onChange={this.handleSecretChange}
                             onKeyPress={this.keyPress}
                />
                <FormControl.Feedback />
            </FormGroup>
        }

        return (
            <form onClick={this.onFormSubmit} onSubmit={this.onFormSubmit}>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select source</ControlLabel>
                    <FormControl componentClass="select" placeholder="select"
                                 value={this.props.exchange.type} onChange={this.typeChange}>
                        <option value="ethereum">Ethereum</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="formToken" validationState={this.getValidationState()}>
                    <ControlLabel>{this.getTokenLabel()}</ControlLabel>
                    <FormControl type="text" value={this.props.exchange.token}
                                 placeholder="Enter token"
                                 onChange={this.handleTokenChange}
                                 onKeyPress={this.keyPress}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Please enter a valid token</HelpBlock>
                </FormGroup>
                {partial}
            </form>
        );
    }
}

export default AccountExchangeForm;
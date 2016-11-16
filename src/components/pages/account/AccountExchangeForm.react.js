import React from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap';

class AccountExchangeForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {exchange: this.props.exchange}; //{value: ''};

        this.handleTokenChange = this.handleTokenChange.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }

    handleTokenChange(event) {
        const exchange = this.state.exchange;
        exchange.token = event.target.value;

        this.setState({exchange: exchange});
    }

    getValidationState() {
        //const length = this.state.value.length;
        const length = this.props.exchange.token.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    }

    typeChange(event) {
        console.log('typeChange', event);

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

    render() {
        return (
            <form onClick={this.onFormSubmit} onSubmit={this.onFormSubmit}>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select source</ControlLabel>
                    <FormControl componentClass="select" placeholder="select"
                                 value={this.props.exchange.type} onChange={this.typeChange}>
                        <option value="select">select</option>
                        <option value="polonix">Polonix</option>
                        <option value="shapshift">Shapeshift</option>
                        <option value="ethereum">Ethereum</option>
                        <option value="bitcoin">Bitcoin</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                    <ControlLabel>Paste token</ControlLabel>
                    <FormControl type="text" value={this.props.exchange.token}
                                 placeholder="Enter token"
                                 onChange={this.handleTokenChange}
                                 onKeyPress={this.keyPress}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Please enter a valid token</HelpBlock>
                </FormGroup>
            </form>
        );
    }
}

export default AccountExchangeForm;
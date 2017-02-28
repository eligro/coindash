import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as exchangeActions from '../../../actions/exchange.actions';
import './AccountPage.css';

import AccountExchange from './AccountExchange.react';

import AccountModal from './AccountModal.react';

class AccountPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            exchange: {type: 'ethereum', token: '', secret: '', created: ''}
        }

        //this.titleChange = this.titleChange.bind(this);
        this.tokenChange = this.tokenChange.bind(this);
        this.createExchange = this.createExchange.bind(this);
        this.deleteExchange = this.deleteExchange.bind(this);

        this.tempFunc = this.tempFunc.bind(this);
    }

    /*titleChange(event) {
        const exchange = this.state.exchange;
        exchange.title = event.target.value;
        this.setState({exchange: exchange});
    }*/

    tokenChange(event) {
        const exchange = this.state.exchange;
        exchange.token = event.target.value;
        this.setState({exchange: exchange});
    }

    createExchange(event) {
        //console.log('saveExchange', this.state);
        this.props.actions.createExchange(this.state.exchange);
    }

    deleteExchange(index) {
        console.log('delete exchange', event, index);
        this.props.actions.deleteExchange(index);
    }

    exchangeComponent(exchange, index) {
        return <AccountExchange key={index} exchange={exchange} deleteExchangeCB={() => {this.deleteExchange(index); }} />;
        /*return(
            <div key={index}>
                <div>{exchange.type}</div>
                <div>{exchange.token}</div>
                <div className="delete-btn">
                    <FontAwesome name="times" onClick={() => { this.deleteExchange(index); } }/>
                </div>
            </div>
        );*/
    }

    tempFunc() {
    }

    render() {
        return (
            <div className="page-container account-page">
                <div className="my-accounts">
                    <div className="page-title">My Accounts</div>
                    <AccountModal onSaveCB={this.createExchange} exchange={this.state.exchange}/>
                </div>
                {this.props.exchanges.map(this.exchangeComponent, this)}
            </div>
        );
    }
}

AccountPage.propTypes = {
    exchanges: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
    return {
        exchanges: state.exchanges
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(exchangeActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
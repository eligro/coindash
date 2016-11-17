import React from 'react';
import FontAwesome from 'react-fontawesome';
import BalanceItem from './BalanceItem.react';


import './Balances.css';

class Balances extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {loading: true};

        setTimeout(() => {
            this.setState({loading: false});
        }, 1500);
    }

    render() {
        const items = [
            {title: 'BTC', amount: 12, value: '$7221.5'},
            {title: 'ETH', amount: 20, value: '$255.44'},
            {title: 'Augur', amount: 20, value: '$109.8'},
            {title: 'DGD', amount: 10, value: '$121.6'}
        ].map((item, index) => <BalanceItem key={index} item={item}/>);

        return (
            <div className="balances-list">
                {this.state.loading && <div className="refresh-cont"><FontAwesome ref="font" className='icon-refresh' name='refresh' size='3x' spin /></div>}
                {!this.state.loading && items}
            </div>
        );
    }
}

export default Balances;
import React, {PropTypes} from 'react';
import FontAwesome from 'react-fontawesome';
import BalanceItem from './BalanceItem.react';


import './Balances.css';

class Balances extends React.Component {
    render() {
        const items = this.props.balances.map((item, index) => <BalanceItem key={index} item={item}/>);

        return (
            <div className="balances-list">
                {!this.props.balances.length && <div className="refresh-cont"><FontAwesome ref="font" className='icon-refresh' name='refresh' size='3x' spin /></div>}
                {this.props.balances.length && items}
            </div>
        );
    }
}

Balances.propTypes = {
    balances: PropTypes.array.isRequired
}

export default Balances;
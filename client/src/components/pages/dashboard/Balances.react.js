import React, {PropTypes} from 'react';
import Spinner from '../../common/Spinner.react';
import BalanceItem from './BalanceItem.react';


import './Balances.css';

class Balances extends React.Component {
    render() {
        const items = this.props.balances.map((item, index) => <BalanceItem key={index} item={item}/>);

        return (
            <div className="balances-list">
                {!this.props.balances.length > 0 && !this.props.error && <Spinner/>}
                {this.props.balances.length > 0 && items}
                {this.props.error && <div>{this.props.error}</div>}
            </div>
        );
    }
}

Balances.propTypes = {
    balances: PropTypes.array.isRequired
}

export default Balances;
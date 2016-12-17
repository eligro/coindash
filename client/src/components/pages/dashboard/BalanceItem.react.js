import React from 'react';
import Utils from '../../../utils/Utils';

class BalanceItem extends React.Component {
    render() {
        return(
            <div className="balance-item">
                <div className="item-title">{this.props.item.title}</div>
                <div className="item-amount">{this.props.item.amount}</div>
                <div className="item-value" title={`$${this.props.item.value}`}>${Utils.toFixed(this.props.item.value, 3)}</div>
            </div>
        );
    }
}

export default BalanceItem;
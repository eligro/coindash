import React from 'react';

class BalanceItem extends React.Component {
    render() {
        return(
            <div className="balance-item">
                <div className="item-title">{this.props.item.title}</div>
                <div className="item-amount">{this.props.item.amount}</div>
                <div className="item-value">({this.props.item.value})</div>
            </div>
        );
    }
}

export default BalanceItem;
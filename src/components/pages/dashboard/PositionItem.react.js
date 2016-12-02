import React from 'react';

class PositionItem extends React.Component {
    render() {
        return(
            <div className="position-item clearfix">
                <div className="position-item-header eth-color ellipsis">{this.props.item.long} ({this.props.item.short})</div>
                <div className="position-item-row">
                    <div className="item-title">Price</div>
                    <div className="item-value">${this.props.item.price}</div>
                </div>
                <div className="position-item-row">
                    <div className="item-title">Daily change</div>
                    <div className="item-value">{this.props.item.cap24hrChange}%</div>
                </div>
                <div className="position-item-row">
                    <div className="item-title">All-time</div>
                    <div className="item-value">{this.props.item.all}</div>
                </div>
            </div>
        );
    }
}

export default PositionItem;
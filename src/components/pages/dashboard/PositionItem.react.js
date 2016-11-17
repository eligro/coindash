import React from 'react';

class PositionItem extends React.Component {
    render() {
        return(
            <div className="position-item clearfix">
                <div className="position-item-header eth-color">{this.props.item.title}</div>
                <div className="position-item-row">
                    <div className="item-title">Daily</div>
                    <div className="item-value">{this.props.item.daily}</div>
                </div>
                <div className="position-item-row">
                    <div className="item-title">Weekly</div>
                    <div className="item-value">{this.props.item.weekly}</div>
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
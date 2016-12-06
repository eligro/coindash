import React from 'react';
import Utils from '../../../utils/Utils';

class PositionItem extends React.Component {
    getName() {
        return `${this.props.item.long} (${this.props.item.short})`;
    }

    render() {
        return(
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 thumb">
                <div className="position-item clearfix">
                    <div className="position-item-header eth-color ellipsis" title={this.getName()}>{this.getName()}</div>
                    <div className="position-item-row">
                        <div className="item-title">Price</div>
                        <div className="item-value ellipsis" title={this.props.item.price}>${Utils.toFixed(this.props.item.price, 2)}</div>
                    </div>
                    <div className="position-item-row">
                        <div className="item-title">Daily change</div>
                        <div className="item-value ellipsis" title={this.props.item.cap24hrChange}>{this.props.item.cap24hrChange}%</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PositionItem;
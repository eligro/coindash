import React from 'react';
import PositionItem from './PositionItem.react';
import FontAwesome from 'react-fontawesome';

import './Positions.css';

class Positions extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {loading: true};

        setTimeout(() => {
            this.setState({loading: false});
        }, 1200);
    }

    render() {

        const items = [
            {title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},{title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},{title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},{title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},
            {title: 'DGD', daily: '+%6', weekly: '+%12.66', all: '+%538.6'}
        ].map((item, index) => <PositionItem key={index} item={item}/>);

        return(
            <div className="positions-cont">
                {this.state.loading && <div className="refresh-cont"><FontAwesome ref="font" className='icon-refresh' name='refresh' size='3x' spin /></div>}
                {!this.state.loading && items}
            </div>
        );
    }
}

export default Positions;
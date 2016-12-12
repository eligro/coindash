import React from 'react';
import StocksChart from '../../../common/charts/stocks/StocksChart.react'

import './PeoplePage.css';

class PeoplePage extends React.Component {

    componentDidMount() {
        const user = this.props.params.user;

        console.log('user', user);
    }


    render() {
        return(
            <div className="page-container people-page">
                <StocksChart/>
            </div>
        );
    }
}

export default PeoplePage;
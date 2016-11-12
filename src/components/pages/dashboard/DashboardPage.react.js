import React from 'react';
import './DashboardPage.css';
import StocksChart from '../../common/charts/stocks/StocksChart.react';

class HomePage extends React.Component {
    render() {
        return (
            <div className="page-container">
                <h4>Profit from BTC</h4>
                <StocksChart/>
            </div>
        );
    }
}

export default HomePage;
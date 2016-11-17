import React from 'react';
import './DashboardPage.css';
import StocksChart from '../../common/charts/stocks/StocksChart.react';
import Balances from './Balances.react';
import Positions from './Positions.react';

class HomePage extends React.Component {
    render() {
        return (
            <div className="page-container dashboard-page">
                <div className="top-cont">
                    <div className="balances-cont">
                        <div className="header">
                            BALANCES
                        </div>
                        <Balances />
                    </div>
                    <div className="chart-cont">
                        <StocksChart/>
                    </div>
                </div>
                <div className="bottom-cont">
                    <div className="positions-header">
                        POSITIONS
                    </div>
                    <div>
                        <Positions />
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
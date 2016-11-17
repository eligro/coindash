import React from 'react';
import './DashboardPage.css';
import StocksChart from '../../common/charts/stocks/StocksChart.react';
import StocksChartRisk from '../../common/charts/stocks/StocksChartRisk.react';
import Balances from './Balances.react';
import Positions from './Positions.react';
import ChartNavigation from './ChartNavigation.react';

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {selectedChart: 1};

        this.chartSelected = this.chartSelected.bind(this);
    }

    chartSelected(selected) {
        console.log('chartSelected', selected);
        this.setState({selectedChart: selected});
    }

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
                        <ChartNavigation handleSelectCB={this.chartSelected}/>
                        {this.state.selectedChart === 1 && <StocksChart/>}
                        {this.state.selectedChart === 2 && <StocksChartRisk/>}
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
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as coinActions from '../../../actions/coins.actions';
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

    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps', nextProps);
        /*if (this.props.front !== nextProps.front) {
            if (!nextProps.isFetching) {
                this.startPoll();
            }
        }*/
    }

    componentWillMount() {
        this.props.coinActions.loadFront()
        this.startPoll();
    }

    componentWillUnmount() {
        this.stopPoll();
    }


    startPoll() {
        this.timeout = setTimeout(() => {
            this.props.coinActions.loadFront()
            this.startPoll();
        }, 20000);
    }

    stopPoll() {
        clearTimeout(this.timeout);
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
                        <Balances balances={this.props.balances}/>
                    </div>
                    <div className="chart-cont">
                        <ChartNavigation handleSelectCB={this.chartSelected}/>
                        {this.state.selectedChart === 1 && <StocksChart chartData={this.props.chartData}/>}
                        {this.state.selectedChart === 2 && <StocksChartRisk/>}
                    </div>
                </div>
                <div className="bottom-cont">
                    <div className="positions-header">
                        WATCHLIST
                    </div>
                    <div>
                        <Positions front={this.props.front}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        balances: state.balances,
        chartData: state.charts.chartData,
        front: state.coins.front
    };
}

function mapDispatchToProps(dispatch) {
    return {
        coinActions: bindActionCreators(coinActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
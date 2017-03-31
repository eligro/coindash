import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {Button} from 'react-bootstrap';
import StocksChart from '../../../common/charts/stocks/StocksChart.react'
import ChartNavigation from '../../dashboard/ChartNavigation.react';
import PerformanceChart from '../../../common/charts/stocks/PerformanceChart.react';
import StocksChartRisk from '../../../common/charts/stocks/StocksChartRisk.react';
import firebase from '../../../../utils/database.react.js';

import './PeoplePage.css';

class PeoplePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {selectedChart: 1, user: this.props.userData[this.props.params.user]};
        this.chartSelected = this.chartSelected.bind(this);
        this.refreshChart = this.refreshChart.bind(this);
        this.copy = this.copy.bind(this);
    }

    componentDidMount() {
    
    }

    chartSelected(selected) {
        this.setState({selectedChart: selected});
    }

    refreshChart() {
        this.props.chartActions.setLoadedChart(false);
        this.props.chartActions.loadChart();
    }

    copy() {
        var id = this.state.user.id;
        console.log(id);
        var ref = firebase.database().ref("users");

        var copiers = ref.child(id).child("copiers");

        copiers.once('value', function(snapshot) {
            copiers.set(snapshot.val() + 1);
        });
    }

    render() {
            return(
            <div className="page-container people-page">
                <div className="top-cont">
                    <div className="chart-cont-p">
                        <Button bsStyle="primary" onClick={this.copy}>Copy</Button>
                        <ChartNavigation handleSelectCB={this.chartSelected} statusText={this.props.statusText} handleRefreshCB={this.refreshChart}/>
                        {this.state.selectedChart === 1 && <PerformanceChart chartData={this.state.user.performanceData} exchanges={this.state.user.exchanges}/>}
                        {this.state.selectedChart === 2 && <StocksChart chartData={this.state.user.chartData} exchanges={this.state.user.exchanges}/>}
                        {this.state.selectedChart === 3 && <StocksChartRisk/>}
                    </div>
                </div>
            </div>
        );
    }
}

StocksChart.propTypes = {
    chartData: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        balances: state.balances,
        chartData: state.charts.chartData,
        performanceData: state.charts.preformanceData,
        front: state.coins.front,
        exchanges: state.exchanges,
        statusText: state.charts.statusText,
        userData: state.copyCrypto.userData
    };
}

export default connect(mapStateToProps)(PeoplePage);
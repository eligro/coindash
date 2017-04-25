import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './DashboardPage.css'
import StocksChart from '../../common/charts/stocks/StocksChart.react'
import StocksChartRisk from '../../common/charts/stocks/StocksChartRisk.react'
import AssetAllocationChart from '../../common/charts/stocks/AssetAllocationChart.react'
import Balances from './Balances.react'
import Positions from './Positions.react'
import ChartNavigation from './ChartNavigation.react'

import * as coinActions from '../../../actions/coins.actions'
import * as chartActions from '../../../actions/chart.actions'
import * as balancesActions from '../../../actions/balances.actions'

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

// import {AccountsManager} from '../../../utils/Accounts/AccountsManager';

class HomePage extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {selectedChart: 1}
    this.chartSelected = this.chartSelected.bind(this)
    this.refreshChart = this.refreshChart.bind(this)
  }

  componentWillReceiveProps (nextProps) {
        // console.log('componentWillReceiveProps', nextProps);
        /* if (this.props.front !== nextProps.front) {
            if (!nextProps.isFetching) {
                this.startPoll();
            }
        } */
  }

  componentWillMount () {
    this.props.coinActions.loadFront()
    this.startPoll()
  }

  componentDidMount () {

        /*
        let manager = AccountsManager.hardcodedManager();

        let day = 24 * 60 * 60;
        let today = Math.floor(Date.now() / 1000);
        manager.dayStatusFromDate(today - 10 * day, function(data){
            // print
            for(let i in data) {
                let day = data[i];
                let usdValue = day.dayFiatValue;
                let depoValue = day.depositsFiatValue;
                let withValue = day.withdrawalsFiatValue;
                let delta = day.delta;

                let date = new Date(day.timestamp*1000);
                let str = date.toISOString() + "\n";
                str += "day $" + usdValue + "\n";
                str += "deposits $" + depoValue + "\n";
                str += "withdrawals $" + withValue + "\n";
                str += "delta %" + delta + "\n";

                for(let x in day.balances) {
                    let t = day.balances[x];
                    str += t.symbol + " " + t.prettyBalance() + "\n";
                }

            }
        });
        // */
  }

  componentWillUnmount () {
    this.stopPoll()
  }

  startPoll () {
    this.timeout = setTimeout(() => {
      this.props.coinActions.loadFront()
      this.startPoll()
    }, 20000)
  }

  stopPoll () {
    clearTimeout(this.timeout)
  }

  chartSelected (selected) {
    this.setState({selectedChart: selected})
  }

  refreshChart () {
    this.props.chartActions.setLoadedChart(false)
    this.props.chartActions.clearCharts()
    this.props.chartActions.loadChart()
    this.props.balancesActions.loadBalances()
  }

  render () {
    const tooltip = (
      <Tooltip id='tooltip'>Add Custom Token</Tooltip>
    )
    return (
      <div className='page-container dashboard-page'>
        <div className='top-cont'>
          <div className='balances-cont'>
            <div className='header'>
              <h3>Balances</h3>
              <OverlayTrigger placement='bottom' overlay={tooltip}>
                <Button bsStyle='primary'>
                  <FontAwesome name='plus' />
                </Button>
              </OverlayTrigger>
            </div>
            <Balances balances={this.props.balances} error={this.props.error} />
          </div>
          <div className='chart-cont'>
            <ChartNavigation handleSelectCB={this.chartSelected} statusText={this.props.statusText} handleRefreshCB={this.refreshChart} />
            {this.state.selectedChart === 1 && <StocksChart chartData={this.props.chartData} dayDataByDate={this.props.portfolioDayDataByDate} exchanges={this.props.exchanges} />}
            {this.state.selectedChart === 2 && <StocksChartRisk />}
            {this.state.selectedChart === 3 && <AssetAllocationChart balances={this.props.balances}/>}
          </div>
        </div>
        <div className='bottom-cont'>
          <div className='positions-header'>
                        WATCHLIST
                    </div>
          <div>
            <Positions front={this.props.front} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    balances: state.balances,
    chartData: state.charts.chartData,
    performanceData: state.charts.preformanceData,
    portfolioDayDataByDate: state.charts.portfolioDayDataByDate,
    front: state.coins.front,
    exchanges: state.exchanges,
    statusText: state.charts.statusText,
    error: state.charts.error
  }
}

function mapDispatchToProps (dispatch) {
  return {
    coinActions: bindActionCreators(coinActions, dispatch),
    chartActions: bindActionCreators(chartActions, dispatch),
    balancesActions: bindActionCreators(balancesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

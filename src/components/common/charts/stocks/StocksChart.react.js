import React from 'react'
import PropTypes from 'prop-types'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'
import {Link} from 'react-router'
// import Highcharts from 'highcharts';
// import Highlight from 'react-highlight';
import Spinner from '../../Spinner.react'
import './StocksChart.css'

class StocksChart extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {loading: true}

        // console.log('chartData', this.props.chartData);

    this.timeout = setTimeout(() => {
      this.setState({loading: false})
            // console.log('chartData', this.props.chartData);
    }, 2500)
  }

  componentDidMount () {
        // let chart = this.refs.chart.getChart();
        // chart.series.addPoint({x: 10, y: 12});

        // let chart = this.refs.chart;
        // console.log('refs', chart);
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  getChartConfig () {
    const marketData = this.props.chartData.btcAggDelta
    const portfolioData = this.props.chartData.portfolioAggDelta
    var dayDataByDate = this.props.dayDataByDate

        // sort in ascending order
    marketData.sort(function (a, b) {
      let v1 = a[0]
      let v2 = b[0]

      return v1 - v2
    })

    portfolioData.sort(function (a, b) {
      let v1 = a[0]
      let v2 = b[0]

      return v1 - v2
    })

    var seriesOptions = []

    seriesOptions[0] = {
      name: 'BTC ($)',
      data: marketData,
      tooltip: {
        valueDecimals: 2
      },
      marker: {
        enabled: true,
        radius: 6
      },
      shadow: true,
      lineWidth: 4
    }

    seriesOptions[1] = {
      name: 'Portfolio ($)',
      data: portfolioData,
      tooltip: {
        valueDecimals: 2
      },
      marker: {
        enabled: true,
        radius: 6
      },
      shadow: true,
      lineWidth: 4
    }

    const config = {
      rangeSelector: {
        selected: 5
      },
      navigator: {
        enabled: false
      },
      tooltip: {
        formatter: function () {
          let benchmarkValue = this.points[0]
          let portfolioValue = this.points[1]

          let date = new Date(portfolioValue.x)
          let firstDay = new Date(portfolioData[0][0])

                    // prepare balances
          let balances = dayDataByDate[portfolioValue.x].balances
          let balancesStr = '<br/>'
          for (let i = 0; i < balances.length; i++) {
            let balance = balances[i]
            if (balance.balance > 0) {
              balancesStr += '<br/>   *' + balance.symbol + '  ' + Math.round(balance.balance * 100) / 100 + ' (' + Math.round(balance.fiatValue * 100) / 100 + ' ' + balance.fiatCurrency + ')'
            }
          }

          let ret = "<b>Portfolio Value " + Math.round(dayDataByDate[portfolioValue.x].dayFiatValue * 100) / 100 + ' USD (' + date.toLocaleDateString() + ')</b>';
          ret += '<br/><b>Portfolio Overall Performance: ' + Math.round((portfolioValue.y - 1) * 100) + '% (' +  firstDay.toLocaleDateString() + ' - ' + date.toLocaleDateString() + ')'
          ret += '<br/>|<br/>Balances:'
          ret +=  balancesStr
          ret += '<br/>|<br/><b>Market Overall Performance: ' + Math.round((benchmarkValue.y - 1) * 100) + '% (' +  firstDay.toLocaleDateString() + ' - ' + date.toLocaleDateString() + ')</b>'

          return ret
        }
      },
            /*            title: {
             text: 'BTC Price'
             }, */
            /* series: [{
             name: 'BTC',
             data: portfolioData,
             tooltip: {
             valueDecimals: 2
             }
             }], */
      series: seriesOptions,
      colors: ['#00a79d', '#f8ac93'],
      xAxis: {
        lineColor: '#fff',
        tickColor: '#fff',
        tickWidth: 3,
        lineWidth: 3,
        labels: {
          style: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#fff',
        tickColor: '#fff',
        tickLength: 5,
        tickWidth: 3,
        tickPosition: 'outside',
        labels: {
          align: 'right',
          x: -10,
          y: 5,
          style: {
            color: '#fff'
          }
        },
        lineWidth: 3
                //  lineColor:'black'
      }
    }

    return config
  }

  render () {
    return (
      <div className='highchart-cont'>
        {!this.props.chartData && this.props.exchanges.length && <div><Spinner /><div className='spinner-msg'>This might take a while...</div></div>}
        {!this.props.exchanges.length && <div className='accounts-msg'>Please add <Link to={'/accounts'}>Accounts</Link></div>}
        {this.props.chartData && <ReactHighstock config={this.getChartConfig()} ref='chart' /> }
      </div>
    )
  }
}

StocksChart.propTypes = {
  chartData: PropTypes.object.isRequired
    //, exchanges: PropTypes.array.isRequired
}

export default StocksChart

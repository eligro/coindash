import React, {PropTypes} from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import {Link} from 'react-router';
// import Highcharts from 'highcharts';
//import Highlight from 'react-highlight';
import Spinner from '../../Spinner.react';
import './StocksChart.css';

class PerformanceChart extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.state = {loading: true};

        //console.log('chartData', this.props.chartData);

        this.timeout = setTimeout(() => {
            this.setState({loading: false});
            //console.log('chartData', this.props.chartData);
        }, 2500);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    getChartConfig() {
        const portfolioData = this.props.chartData;
        var dayBalances = this.props.dayBalances;

        // sort in ascending order
        portfolioData.sort(function(a, b) {
            let v1 = a[0];
            let v2 = b[0];

            return v1 - v2;
        });

        var seriesOptions = [];

        seriesOptions[0] = {
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
        };

        const config = {
            rangeSelector: {
                selected: 5
            },
            navigator: {
                enabled: false
            },
            tooltip : {
                formatter: function () {
                    let date = new Date(this.x);

                    // prepare balances
                    let balances = dayBalances[this.x];
                    let balancesStr = "<br/>";
                    for (let i=0; i < balances.length ; i ++) {
                        let balance = balances[i];
                        balancesStr += "<br/>" + balance.symbol + "  " + balance.balance + " (" + balance.fiatValue + " " + balance.fiatCurrency + ")";
                    }


                    let ret = "<b>" + date.toLocaleDateString() + "</b><br/><b>Day Balance: $" + (Math.round(this.y * 100) / 100) + "</b>" + balancesStr;


                    return ret;
                }
            },
            /*            title: {
             text: 'BTC Price'
             },*/
            /*series: [{
             name: 'BTC',
             data: portfolioData,
             tooltip: {
             valueDecimals: 2
             }
             }],*/
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

        return config;
    }

    render() {
        return(
            <div className="highchart-cont">
                {!this.props.chartData && this.props.exchanges.length && <div><Spinner/><div className="spinner-msg">This might take a while...</div></div>}
                {!this.props.exchanges.length && <div className="accounts-msg">Please add <Link to={'/accounts'}>Accounts</Link></div>}
                {this.props.chartData && <ReactHighstock config={this.getChartConfig()} ref="chart" /> }

            </div>
        );
    }
}

PerformanceChart.propTypes = {
    chartData: PropTypes.object.isRequired,
    exchanges: PropTypes.array.isRequired
    
};

export default PerformanceChart;
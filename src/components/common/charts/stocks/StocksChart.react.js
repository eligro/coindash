import React from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import Highcharts from 'highcharts';
//import Highlight from 'react-highlight';
import FontAwesome from 'react-fontawesome';
import './StocksChart.css';

export default class StocksChart extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {loading: true};

        setTimeout(() => {
            this.setState({loading: false});
        }, 2500);
    }

    componentDidMount() {
        //let chart = this.refs.chart.getChart();
        //chart.series.addPoint({x: 10, y: 12});

        //let chart = this.refs.chart;
        //console.log('refs', chart);
    }

    render() {
        //const data = [[1220832000000, 22.56], [1220918400000, 21.67], [1221004800000, 21.66], [1221091200000, 21.81], [1221177600000, 21.28], [1221436800000, 20.05], [1221523200000, 19.98], [1221609600000, 18.26], [1221696000000, 19.16], [1221782400000, 20.13], [1222041600000, 18.72], [1222128000000, 18.12], [1222214400000, 18.39], [1222300800000, 18.85], [1222387200000, 18.32], [1222646400000, 15.04], [1222732800000, 16.24], [1222819200000, 15.59], [1222905600000, 14.3], [1222992000000, 13.87], [1223251200000, 14.02], [1223337600000, 12.74], [1223424000000, 12.83], [1223510400000, 12.68], [1223596800000, 13.8], [1223856000000, 15.75], [1223942400000, 14.87], [1224028800000, 13.99], [1224115200000, 14.56], [1224201600000, 13.91], [1224460800000, 14.06], [1224547200000, 13.07], [1224633600000, 13.84], [1224720000000, 14.03], [1224806400000, 13.77], [1225065600000, 13.16], [1225152000000, 14.27], [1225238400000, 14.94], [1225324800000, 15.86], [1225411200000, 15.37], [1225670400000, 15.28], [1225756800000, 15.86], [1225843200000, 14.76], [1225929600000, 14.16], [1226016000000, 14.03], [1226275200000, 13.7], [1226361600000, 13.54], [1226448000000, 12.87], [1226534400000, 13.78], [1226620800000, 12.89], [1226880000000, 12.59], [1226966400000, 12.84], [1227052800000, 12.33], [1227139200000, 11.5], [1227225600000, 11.8], [1227484800000, 13.28], [1227571200000, 12.97], [1227657600000, 13.57], [1227830400000, 13.24], [1228089600000, 12.7], [1228176000000, 13.21], [1228262400000, 13.7], [1228348800000, 13.06], [1228435200000, 13.43], [1228694400000, 14.25], [1228780800000, 14.29], [1228867200000, 14.03], [1228953600000, 13.57], [1229040000000, 14.04], [1229299200000, 13.54]];

        const btcData = [[1448928000000, 1000], [1451606400000, 1203.34], [1454284800000, 1036.21], [1456790400000, 1203.34], [1459468800000, 1158.77], [1462060800000, 1259.05], [1464739200000, 1501.39], [1467331200000, 1880.22], [1470009600000, 1688.02],	[1472688000000, 1596.10],	[1475280000000, 1713.09],	[1477958400000, 2027.86]];
        const portfolioData = [[1448928000000, 1000], [1451606400000, 1200], [1454284800000, 950], [1456790400000, 1250], [1459468800000, 1050], [1462060800000, 1039.5], [1464739200000, 1237.5], [1467331200000, 1287], [1470009600000, 1485], [1472688000000, 1039.5],	[1475280000000, 1089],	[1477958400000, 1237]];

        var seriesOptions = [];

        seriesOptions[0] = {
            name: 'BTC',
            data: btcData,
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

        seriesOptions[1] = {
            name: 'Portfolio',
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
            yAxis: {
                gridLineWidth: 0,
                //     tickColor: 'black',
                tickLength: 5,
                tickWidth: 1,
                tickPosition: 'outside',
                labels: {
                    align: 'right',
                    x:-10,
                    y:5
                },
                lineWidth:1,
                //  lineColor:'black'
            }
            //color: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            //fillColor: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        };

        return(
            <div>
                {this.state.loading && <div className="refresh-cont"><FontAwesome ref="font" className='icon-refresh' name='refresh' size='3x' spin /></div>}
                {!this.state.loading && <ReactHighstock config={config} ref="chart" /> }
            </div>
        );
    }
}
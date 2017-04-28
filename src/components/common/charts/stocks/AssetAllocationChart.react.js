import React from 'react'

import { Doughnut } from 'react-chartjs-2'

class AssetAllocationChart extends React.Component {

  getData () {
    return
  }

  colors () {
    return [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }

  render () {
    const data = {
		    labels: this.props.balances.map((item, index) => item.title),
		    datasets: [
		        {
		            data: this.props.balances.map((item, index) => item.value),
		            backgroundColor: this.props.balances.map((item, index) => '#' + ((1 << 24) * Math.random() | 0).toString(16)),
		            hoverBackgroundColor: this.props.balances.map((item, index) => '#' + ((1 << 24) * Math.random() | 0).toString(16))
		        }]
    }

    return (
      <div>
        <Doughnut data={data} />
      </div>
    )
  }
}

export default AssetAllocationChart

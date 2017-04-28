import React from 'react'
import {Nav, NavItem} from 'react-bootstrap'
import { Line } from 'rc-progress'

import './ChartNavigation.css'

import FontAwesome from 'react-fontawesome'

class ChartNavigation extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {activeKey: 1}

    this.handleSelect = this.handleSelect.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleSelect (selectedKey) {
    this.setState({activeKey: selectedKey})

    this.props.handleSelectCB(selectedKey)
  }

  handleRefresh () {
    this.props.handleRefreshCB()
  }

  render () {
    var progressBar
    if (+this.props.statusText < 100) {
      progressBar = <div className='status-cont'>
        <div className=''> {this.props.statusText} %</div>
        <Line percent={this.props.statusText} strokeWidth='4' strokeColor='#FFFFFF' />
      </div>
    }

    return (
      <div className='chart-navigation'>
        {progressBar}
        <div className='btn-cont'>
          <button className='btn' onClick={this.handleRefresh}>
            <FontAwesome name='refresh' size='2x' />
          </button>
        </div>
        <Nav className='navbar-cont' bsStyle='pills' activeKey={this.state.activeKey} onSelect={(selectedKey) => { this.handleSelect(selectedKey) }}>
          <NavItem eventKey={1} title='item1'>Performance</NavItem>
          {/* <NavItem eventKey={2} title='Item2'>Risk</NavItem> */}
          <NavItem eventKey={3} title='Item3'>Allocation Table</NavItem>
        </Nav>

      </div>
    )
  }
}

export default ChartNavigation

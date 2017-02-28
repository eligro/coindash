import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';

import './ChartNavigation.css';

class ChartNavigation extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {activeKey: 1};

        this.handleSelect = this.handleSelect.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }



    handleSelect(selectedKey) {
        this.setState({activeKey: selectedKey});

        this.props.handleSelectCB(selectedKey);
    }

    handleRefresh() {
        this.props.handleRefreshCB();
    }
        
    render() {
        return (
            <div className="chart-navigation">
                <div className="status-cont">
                    <p className="title"> {this.props.statusText} </p>
                </div>
                <div className="btn-cont">
                    <button className="btn" onClick={this.handleRefresh}>Click me</button>
                </div>
                <Nav className="navbar-cont" bsStyle="pills" activeKey={this.state.activeKey} onSelect={(selectedKey) => { this.handleSelect(selectedKey);}}>
                    <NavItem eventKey={1} title="item1">Profit / Lost</NavItem>
                    <NavItem eventKey={2} title="Item2">Risk</NavItem>
                </Nav>
                
            </div>
        );
    }
}

export default ChartNavigation;
import React from 'react';
//import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';

export default class LeftnavItem extends React.Component {
    redirectToPage() {
        browserHistory.push(this.props.item.route);
    }

    render() {
        return (
            <li onClick={this.redirectToPage.bind(this)}>
                <div className="icon-circle">
                    <FontAwesome name={this.props.item.icon} size='2x'
                                 style={this.props.item.style}/>
                </div>
                <div className="title">{this.props.item.title || {}}</div>
            </li>
        );
    }
}
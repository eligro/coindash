import React from 'react';
//import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

export default class LeftnavItem extends React.Component {
    redirectToPage() {
        console.log('this.item', this.props.item.route);
        //this.context.router.push('/about');
        //TODO - this is too bad
        window.location = this.props.item.route;
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
import React, {PropTypes} from 'react';
//import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import FontAwesome from 'react-fontawesome';

export default class LeftnavItem extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static contextTypes = {
        router: PropTypes.object
    };

    redirectToPage() {
        browserHistory.push(this.props.item.route);
        console.log('leftNavItem redirectToPage');
    }

    render() {
        //console.log(this.context.router.isActive(this.props.item.route), this.props);

        //var activeClass = this.context.router.isActive(this.props.item.route) ? 'active' : ''
        var activeClass = this.context.router.location.pathname === this.props.item.route ? 'active' : ''

        return (
            <li onClick={this.redirectToPage.bind(this)} className={activeClass}>
                <div className="icon-circle">
                    <FontAwesome name={this.props.item.icon} size='2x'
                                 style={this.props.item.style}/>
                </div>
                <div className="title">{this.props.item.title}</div>
            </li>
        );
    }
}
import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router';
import { browserHistory
 } from 'react-router'
import FontAwesome from 'react-fontawesome'
import 'font-awesome/css/font-awesome.css'

export default class LeftnavItem extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  redirectToPage () {
    if(this.props.item.route != '/copyCrypto' && this.props.item.route != '/about')
      browserHistory.push(this.props.item.route)
  }

  render () {
        // console.log(this.context.router.isActive(this.props.item.route), this.props);

        // var activeClass = this.context.router.isActive(this.props.item.route) ? 'active' : ''
    var activeClass = this.context.router.location.pathname === this.props.item.route ? 'active' : ''

    return (
      <li onClick={this.redirectToPage.bind(this)} className={activeClass}>
        <div className='icon-circle'>
          <FontAwesome name={this.props.item.icon} size='2x'
            style={this.props.item.style} />
        </div>
        <div className='title'>{this.props.item.title}</div>
      </li>
    )
  }
}

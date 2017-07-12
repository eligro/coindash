import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import FontAwesome from 'react-fontawesome'
import 'font-awesome/css/font-awesome.css'

export default class LeftnavItem extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render () {
    return (
      <li>
        <Link to={this.props.item.route} disabled={this.props.item.disabled} activeClassName='active' onlyActiveOnIndex={true}>
          <FontAwesome name={this.props.item.icon} style={this.props.item.style} />
          <span className='title'>{this.props.item.title}</span>
        </Link>
      </li>
    )
  }
}

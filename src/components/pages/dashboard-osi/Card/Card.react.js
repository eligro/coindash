import React, { Component } from 'react'
import './Card.css'

class Card extends Component {
  render () {
    let { className, ...props } = this.props
    className = ['Card', className].join(' ')
    return (
      <div {...props} className={className}>{this.props.children}</div>
    )
  }
}

export default Card

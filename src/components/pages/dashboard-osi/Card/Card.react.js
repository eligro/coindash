import React, { Component } from 'react'
import './Card.css'

class Card extends Component {
  render () {
    let { className, ...props } = this.props
    className = ['Card', className].join(' ')
    return (
      <div className='card'>
        <div {...props} className={className}>{this.props.children}</div>
      </div>
    )
  }
}

export default Card

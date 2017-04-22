import React from 'react'
import FontAwesome from 'react-fontawesome'

export default class Spinner extends React.Component {
  render () {
    return (
      <div className='refresh-cont'><FontAwesome ref='font' className='icon-refresh' name='refresh' size='3x' spin /></div>
    )
  }
}

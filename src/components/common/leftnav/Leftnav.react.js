import React from 'react'
import './Leftnav.css'
import LeftnavItem from './LeftnavItem.react'

export default class Leftnav extends React.Component {

  defaultProps () {
    return { items: [
            {title: 'dashboard', icon: 'tachometer'}
    ] }
  }

  render () {
    const menuItems = [
            {title: 'dashboard', icon: 'tachometer', route: '/', style: {paddingTop: '6px'}},
            {title: 'My Accounts', icon: 'cogs', route: '/accounts', style: {paddingTop: '10px'}},
            {title: 'Copy ICO', icon: 'newspaper-o', route: '/copyCrypto', style: {paddingTop: '11px', opacity: 0.2 }},
            {title: 'about', icon: 'university', route: '/about', style: {paddingTop: '8px', opacity: 0.2 }}
            /* {title: 'about', icon: 'building-o', route: '/accounts', style: {paddingTop: '10px'}},
            {title: 'links', icon: 'link', route: '/accounts', style: {paddingTop: '11px'}} */
    ].map((item, index) => <LeftnavItem key={index} item={item} />)

    return (
      <div className='left-nav'>
        <ul>
          {menuItems}
        </ul>
      </div>
    )
  }
}

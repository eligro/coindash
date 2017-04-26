import React from 'react'
import './Sidenav.css'
import SidenavItem from './SidenavItem.react'

export default class Leftnav extends React.Component {

  defaultProps () {
    return { items: [
            {title: 'dashboard', icon: 'tachometer'}
    ] }
  }

  render () {
    const disabled = true
    const menuItems = [
            {title: 'dashboard', icon: 'tachometer', route: '/', style: {paddingTop: '6px'}},
            {title: 'My Accounts', icon: 'cogs', route: '/accounts', style: {paddingTop: '10px'}},
            {title: 'Copy ICO', icon: 'newspaper-o', route: '/copyCrypto', style: { paddingTop: '11px' }, disabled},
            {title: 'about', icon: 'university', route: '/about', style: { paddingTop: '8px' }, disabled}
            /* {title: 'about', icon: 'building-o', route: '/accounts', style: {paddingTop: '10px'}},
            {title: 'links', icon: 'link', route: '/accounts', style: {paddingTop: '11px'}} */
    ].map((item, index) => <SidenavItem key={index} item={item} />)

    return (
      <div className='sidenav'>
        <ul>
          {menuItems}
        </ul>
      </div>
    )
  }
}

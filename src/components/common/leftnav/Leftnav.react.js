import React from 'react';
import './Leftnav.css';
import LeftnavItem from './LeftnavItem.react';

export default class Leftnav extends React.Component {

    defaultProps() {
        return { items: [
            {title: 'dashboard', icon: 'tachometer'}
        ] }
    }


    render() {

        const menuItems = [
            {title: 'dashboard', icon: 'tachometer', route: '/', style: {paddingTop: '6px'}},
            {title: 'investments', icon: 'university', route: '/account', style: {paddingTop: '8px'}},
            {title: 'account', icon: 'cogs', route: '/account', style: {paddingTop: '10px'}},
            {title: 'news', icon: 'newspaper-o', route: '/account', style: {paddingTop: '11px'}},
            {title: 'about', icon: 'building-o', route: '/account', style: {paddingTop: '10px'}},
            {title: 'links', icon: 'link', route: '/account', style: {paddingTop: '11px'}}
        ].map((item, index) => <LeftnavItem key={index} item={item}/>);


        return (
            <div className="left-nav">
                <ul>
                    {menuItems}
                </ul>
            </div>
        );
    }
}
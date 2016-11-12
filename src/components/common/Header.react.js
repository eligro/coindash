import React from 'react';
import { IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

export default class Header extends React.Component {

    someCallback() {
        console.log('someCallback');
    }

    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <IndexLinkContainer to="/">
                            <IndexLink to="/">COIN<b>DASH</b></IndexLink>
                        </IndexLinkContainer>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav pullRight>
                    <LinkContainer to="/settings">
                        <NavItem eventKey={1}>Settings</NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar>
        );
    }
}
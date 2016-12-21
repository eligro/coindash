import React from 'react';
import { IndexLink, Link } from 'react-router';
import { Navbar, Nav, NavItem, Modal, Button } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import './Header.css';

export default class Header extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {showHelp: null};

        this.closeHelp = this.closeHelp.bind(this);
        this.openHelp = this.openHelp.bind(this);
        this.isShowHelp = this.isShowHelp.bind(this);
    }

    openHelp(event) {
        console.log('show help', this.props.extension);
        this.setState({ showHelp: true });
    }

    closeHelp(event) {
        console.log('closeHelp', event);
        this.setState({ showHelp: false });
    }

    isShowHelp() {
        return this.props.extension.version === '0.0.0' && this.state.showHelp === null || this.state.showHelp;
    }

    render() {

        const Extension = this.props.extension.version === '0.0.0' ?
            <div className="extension-link">Please download the <a href="https://chrome.google.com/webstore/detail/coindashio/bmakfigpeajegddeamfkmnambomhmnoh" target="_blank">Coindash.io Chrome Extension</a> from the Chrome web store</div>
            : <div className="extension-link">You already have the <a href="https://chrome.google.com/webstore/detail/coindashio/bmakfigpeajegddeamfkmnambomhmnoh" target="_blank">Coindash.io Chrome Extension</a> installed (version: {this.props.extension.version})</div>

        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <IndexLinkContainer to="/">
                                <IndexLink to="/">COIN<b>DASH</b></IndexLink>
                            </IndexLinkContainer>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <LinkContainer onClick={this.openHelp} to="#">
                            <NavItem eventKey={1}>Help</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar>
                <Modal show={this.isShowHelp()} onHide={this.closeHelp}>
                    <Modal.Header closeButton>
                        <Modal.Title>Help</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="help-modal-body">
                            <p>
                                {Extension}
                            </p>
                            <p>
                                <div>Start using Coindash by adding your Etehreum and/poloniex <Link to={'/accounts'}>accounts</Link></div>
                            </p>
                            <p>
                                <div>Coindash.io works in the browser. None of your data is touching our server.</div>
                                <div>This extension will enable your browser to connect to certain exchanges API.</div>
                                <div>Later, you'll be able to opt-in and to securely save some of your data on our server.</div>
                                <div>Coindash source code is available in here: <a href="https://bitbucket.org/coindash/coindashio" target="_blank">https://bitbucket.org/coindash/coindashio</a></div>
                            </p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeHelp}>Got it</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
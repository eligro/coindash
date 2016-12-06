import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './App.css';
import './common/navbar/Navbar.css';

import Leftnav from './common/leftnav/Leftnav.react';

//import Navbar from './common/navbar/Navbar.react';
import Header from './common/Header.react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <div className="main-container container-fluid">
            <Leftnav/>
            {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;

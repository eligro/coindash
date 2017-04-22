import React from 'react'
import { connect } from 'react-redux'
import { IndexLink, Link } from 'react-router'
import { Navbar, Nav, NavItem, Modal, Button, ControlLabel, FormControl, HelpBlock, FormGroup } from 'react-bootstrap'
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import firebase from './../../utils/database.react.js'
import FileUploader from 'react-firebase-file-uploader'

import './Header.css'

const { localStorage, alert } = window

class Header extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {showHelp: null, showShare: false, userName: null, image: null}

    this.closeHelp = this.closeHelp.bind(this)
    this.openHelp = this.openHelp.bind(this)
    this.isShowHelp = this.isShowHelp.bind(this)
    this.closeShare = this.closeShare.bind(this)
    this.openShare = this.openShare.bind(this)
    this.share = this.share.bind(this)
    this.saveUserName = this.saveUserName.bind(this)
  }

  componentWillMount () {

  }

  openHelp (event) {
    this.setState({ showHelp: true })
  }

  closeHelp (event) {
    this.setState({ showHelp: false })
  }

  openShare (event) {
    this.setState({ showShare: true })
  }

  closeShare (event) {
    this.setState({ showShare: false, image: null, userName: null })
  }

  isShowHelp () {
    return this.props.extension.version === '0.0.0' && this.state.showHelp === null || this.state.showHelp
  }

  saveUserName (event) {
    this.setState({userName: event.target.value})
  }

  share (event) {
    if (this.state.image === null || this.state.userName === null) {} else {
      if (this.props.chartLoaded === true) {
        var id = getDataFromLocalStorage()
        var key = firebase.database().ref().push().key
        var ref = firebase.database().ref('users')

        var userData = {
          id: key,
          performanceData: this.props.performanceData,
          balances: this.props.balances,
          exchanges: this.props.exchanges,
          chartData: this.props.chartData,
          shortDelta: this.props.shortDelta,
          longDelta: this.props.longDelta,
          copiers: 0,
          userName: this.state.userName,
          image: this.state.image
        }
        if (id === null || id === 'default' || id === '') {
          userData.id = key
          ref.child(key).set(userData)
          saveDataToLocalStorage(key)
          console.log('saved in ls + fb')
        } else {
          userData.id = id
          ref.child(id).set(userData)
          console.log('saved in fb')
        }
      } else {
        console.log('chart not loaded')
        alert('Please load chart first')
      }
      this.setState({uploaded: false})
      this.closeShare()
    }
  }

  getUserNameValidationState () {
    if (this.state.userName != null) {
      return 'success'
    } else {
      return 'error'
    }
  }

  getImageValidationState () {
    if (this.state.uploaded) {
      return 'success'
    } else {
      return 'error'
    }
  }

  handleUploadStart (file) {
    this.setState({isUploading: true, progress: 0})
  }
  handleProgress (progress) { return this.setState({progress}) }
  handleUploadError (error) {
    this.setState({isUploading: false, progress: 0})
    console.error(error)
  }
  handleUploadSuccess (filename) {
    this.setState({avatar: filename, progress: 100, isUploading: false, uploaded: true})
    firebase.storage().ref('images').child(filename).getDownloadURL().then(url => { this.state.image = url })
  }

  render () {
    const Extension = this.props.extension.version === '0.0.0'
      ? <div className='extension-link'>Please download the <a href='https://chrome.google.com/webstore/detail/coindashio/bmakfigpeajegddeamfkmnambomhmnoh' target='_blank'>Coindash.io Chrome Extension</a> from the Chrome web store</div>
      : <div className='extension-link'>You already have the <a href='https://chrome.google.com/webstore/detail/coindashio/bmakfigpeajegddeamfkmnambomhmnoh' target='_blank'>Coindash.io Chrome Extension</a> installed (version: {this.props.extension.version})</div>

    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLinkContainer to='/'>
                <IndexLink to='/'>COIN<b>DASH</b></IndexLink>
              </IndexLinkContainer>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <LinkContainer onClick={this.openShare} to='#'>
              <NavItem eventKey={1}>Share</NavItem>
            </LinkContainer>
            <LinkContainer onClick={this.openHelp} to='#'>
              <NavItem eventKey={1}>Help</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar>
        <Modal show={this.isShowHelp()} onHide={this.closeHelp}>
          <Modal.Header closeButton>
            <Modal.Title>Help</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='help-modal-body'>
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
                <div>Coindash source code is available in here: <a href='https://bitbucket.org/coindash/coindashio' target='_blank'>https://bitbucket.org/coindash/coindashio</a></div>
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeHelp}>Got it</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showShare} onHide={this.closeShare}>
          <Modal.Header closeButton>
            <Modal.Title>Share Your Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form >
              <FormGroup controlId='formToken' validationState={this.getUserNameValidationState()}>
                <ControlLabel>UserName</ControlLabel>
                <FormControl type='text' placeholder='Enter userName' onChange={this.saveUserName} />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup controlId='formToken' validationState={this.getImageValidationState()}>
                <ControlLabel>Profile Image</ControlLabel>
                <FileUploader
                  accept='image/*'
                  name='avatar'
                  randomizeFilename
                  storageRef={firebase.storage().ref('images')}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  onProgress={this.handleProgress}
            />
                <HelpBlock>Please Upload Image</HelpBlock>
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.share} >Share</Button>
            <Button onClick={this.closeShare} >Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    balances: state.balances,
    chartData: state.charts.chartData,
    performanceData: state.charts.preformanceData,
    front: state.coins.front,
    exchanges: state.exchanges,
    statusText: state.charts.statusText,
    chartLoaded: state.charts.chartLoaded,
    shortDelta: state.charts.shortDelta,
    longDelta: state.charts.longDelta
  }
}

function saveDataToLocalStorage (obj) {
  localStorage.setItem('id', JSON.stringify(obj))
}

function getDataFromLocalStorage (obj) {
  if (localStorage.getItem('id') != null) { return localStorage.getItem('id').substring(1, localStorage.getItem('id').length - 1) } else { return '' }
}

export default connect(mapStateToProps, firebase)(Header)

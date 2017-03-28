import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PeopleItemSmall from './people/PeopleItemSmall.react';
import * as copyCryptoActions from '../../../actions/copyCrypto.actions';

import './CopyCryptoPage.css';

class CopyCryptoPage extends React.Component {
    // constructor(props, context) {
    //     super(props, context);

        
    // }

    componentWillMount() {
        this.props.copyCryptoActions.getUsersData();
    }

    render() {
      const listItems = this.props.userData.map(function(data, i){
        console.log("*******");
        console.log(getDataFromLocalStorage());
        console.log(data.id);
        if(data.id != getDataFromLocalStorage())
            return <PeopleItemSmall key={i} data={data} index={i} />
      });
        return (
            <div className="page-container copy-page">
            <div>{listItems}</div>
                
            </div>
        );
    }
}

// CopyCryptoPage.propTypes = {

// }

function getDataFromLocalStorage(obj) {
    if(localStorage.getItem("id") != null)
        return localStorage.getItem("id").substring(1, localStorage.getItem("id").length - 1)
    else
        return "";
}

function mapStateToProps(state, ownProps) {
  console.log(state.copyCrypto.userData);
    return {
        exchanges: state.exchanges,
        userData: state.copyCrypto.userData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        //actions: bindActionCreators(exchangeActions, dispatch)
        // onGetUsersData: () => dispatch(copyCryptoActions.getUsersData())
        copyCryptoActions: bindActionCreators(copyCryptoActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyCryptoPage);
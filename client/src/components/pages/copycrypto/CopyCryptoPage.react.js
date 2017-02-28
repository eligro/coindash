import React from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import PeopleItemSmall from './people/PeopleItemSmall.react';

import './CopyCryptoPage.css';


class CopyCryptoPage extends React.Component {
    // constructor(props, context) {
    //     super(props, context);
    // }

    render() {
        return (
            <div className="page-container copy-page">
                <div>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                    <PeopleItemSmall/>
                </div>
            </div>
        );
    }
}

// CopyCryptoPage.propTypes = {

// }

function mapStateToProps(state, ownProps) {
    return {
        exchanges: state.exchanges
    };
}

function mapDispatchToProps(dispatch) {
    return {
        //actions: bindActionCreators(exchangeActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyCryptoPage);
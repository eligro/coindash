import React from 'react';
import {Button} from 'react-bootstrap';
import ExampleImage from '../helpers/ExampleImage';
import {browserHistory} from 'react-router';

import './PeopleItemSmall.css';

class PeopleItemSmall extends React.Component {
    constructor(props, context) {
        super(props, context);
    }


    redirectToPage() {
        const user = 'JonSmith';
        browserHistory.push(`/people/@${user}`);
    }

    render() {
        return(
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 thumb">
                <div className="people-item">
                    <div className="people-header clearfix">
                        <ExampleImage src="https://s3.amazonaws.com/uifaces/faces/twitter/beshur/128.jpg"/>
                        <div onClick={this.redirectToPage.bind(this)} className="name ellipsis">@JonSmith</div>
                    </div>
                    <div className="people-body">
                        <div>38.11%</div>
                        <div>Profit</div>
                        <div>62 days</div>
                    </div>
                    <div className="people-footer clearfix">
                        <div className="note">11 Copers</div>
                        <div className="btn-cont">
                            <Button bsStyle="primary">Copy</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PeopleItemSmall;
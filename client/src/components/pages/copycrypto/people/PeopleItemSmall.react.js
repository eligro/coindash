import React from 'react';
import {Button} from 'react-bootstrap';
import ExampleImage from '../helpers/ExampleImage';
import {browserHistory} from 'react-router';

import './PeopleItemSmall.css';

class PeopleItemSmall extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {showModal: false};
    }

    redirectToPage() {
        const user = this.props.index;
        browserHistory.push(`/people/${user}`);
    }

    render() {
        return(
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 thumb" onClick={this.open}>
                <div className="people-item">
                    <div className="people-header clearfix">
                        <ExampleImage src={this.props.data.image}/>
                        <div onClick={this.redirectToPage.bind(this)} className="name ellipsis"> {this.props.data.userName} </div>
                    </div>
                    <div className="people-body">
                        <div>7 Days: {this.props.data.shortDelta.toFixed(2)}%</div>
                        <div>12 Months: {this.props.data.longDelta.toFixed(2)}%</div>
                        <div></div>
                    </div>
                    <div className="people-footer clearfix">
                        <div className="note">Copiers: {this.props.data.copiers}</div>
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
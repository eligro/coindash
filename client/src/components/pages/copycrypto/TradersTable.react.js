import React from 'react';
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import {Table, Column, Cell} from 'fixed-data-table';
import ExampleImage from './helpers/ExampleImage'
import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
import './TradersTable.css';


const DateCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {data.getObjectAt(rowIndex)[col].toLocaleString()}
    </Cell>
);

const ImageCell = ({rowIndex, data, col, ...props}) => (
    <ExampleImage
        src={data.getObjectAt(rowIndex)[col]}
    />
);

const LinkCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        <a href="#">{data.getObjectAt(rowIndex)[col]}</a>
    </Cell>
);

const TextCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
        {data.getObjectAt(rowIndex)[col]}
    </Cell>
);

class TradersTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataList: new FakeObjectDataListStore(100),
        };
    }

    render() {
        var {dataList} = this.state;
        return (
            <div className="traders-table-cont">
                <ResponsiveFixedDataTable
                    rowHeight={50}
                    headerHeight={50}
                    rowsCount={dataList.getSize()}
                    width={1000}
                    height={500}
                    {...this.props}>
                    <Column
                        cell={<ImageCell data={dataList} col="avatar" />}
                        fixed={true}
                        width={50}
                    />
                    <Column
                        header={<Cell>User</Cell>}
                        cell={<LinkCell data={dataList} col="user" />}
                        fixed={true}
                        width={100}
                    />
                    <Column
                        header={<Cell>Member since</Cell>}
                        cell={<DateCell data={dataList} col="date" />}
                        width={200}
                    />
                    <Column
                        header={<Cell>Member since</Cell>}
                        cell={<TextCell data={dataList} col="city" />}
                        width={100}
                    />
                    <Column
                        header={<Cell>Street</Cell>}
                        cell={<TextCell data={dataList} col="street" />}
                        width={200}
                    />
                    <Column
                        header={<Cell>Zip Code</Cell>}
                        cell={<TextCell data={dataList} col="zipCode" />}
                        width={200}
                    />
                    <Column
                        header={<Cell>Email</Cell>}
                        cell={<LinkCell data={dataList} col="email" />}
                        width={200}
                    />
                </ResponsiveFixedDataTable>
            </div>
        );
    }
}

export default TradersTable;


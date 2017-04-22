import React from 'react'
import PositionItem from './PositionItem.react'
import Spinner from '../../common/Spinner.react'

import './Positions.css'

class Positions extends React.Component {
  constructor (props, context) {
    super(props, context)

        // this.state = {loading: true};

    setTimeout(() => {
            // this.setState({loading: false});
    }, 1200)
  }

  render () {
    const frontCoins =
      [{name: 'Bitcoins', short: 'BTC'}, {name: 'Ethereum', short: 'ETH'}, {name: 'Ripple', short: 'XRP'}, {name: 'Litecoin', short: 'LTC'}, {name: 'Monero', short: 'MXR'},
                {name: 'Ethereum Classic', short: 'ETC'}, {name: 'Dash', short: 'DASH'}, {name: 'Augur', short: 'REP'}, {name: 'Steem', short: 'STEAM'}, {name: 'NEM', short: 'XEM'},
                {name: 'MaidSafeCoin', short: 'MAID'}, {name: 'Waves', short: 'WAVES'}, {name: 'Dogecoin', short: 'DOGE'}, {namr: 'Factom', short: 'FCT'}, {name: 'DigixDAO', short: 'DGD'},
                {name: 'Lisk', short: 'LSK'}, {name: 'Iconomi', short: 'ICN'}, {name: 'Peerplays', short: 'PEERPLAYS'}, {name: 'Gulden', short: 'NLG'}, {name: 'GameCredit', short: 'GAME'}]

    const frontShort = frontCoins.map(item => item.short)

        /* const items = [
            {title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},{title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},{title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},{title: 'BTC', daily: '+%1.2', weekly: '+%8.65', all: '+%9938.4'},
            {title: 'ETH', daily: '+%1.7', weekly: '+%2.5', all: '+%6538.4'},
            {title: 'DGD', daily: '+%6', weekly: '+%12.66', all: '+%538.6'}
        ].map((item, index) => <PositionItem key={index} item={item}/>); */

    return (
      <div className='positions-cont'>
        {!this.props.front && <Spinner />}
        {this.props.front && this.props.front.filter(item => frontShort.indexOf(item.short) > -1).map((item, index) => <PositionItem key={index} item={item} />)}

      </div>
    )
  }
}

export default Positions

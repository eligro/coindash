import React from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Circle } from 'rc-progress'
import FontAwesome from 'react-fontawesome'
import Card from '../Card/Card.react'
import { currencyFormat, Flex } from '../Dashboard.react'
import Balances from '../../dashboard/Balances.react'
import ScrollArea from 'react-scrollbar'

const Valuable = props => (<OverlayTrigger placement='top' overlay={<Tooltip id='{props.className}-valuable'>Your {props.className} valuable token</Tooltip>}>
  <div className={props.className}>

    <value>{props.value.toLocaleString(...currencyFormat)}</value>
    <label><FontAwesome name='circle' /> {props.title}</label>
  </div>
</OverlayTrigger>)

export default (props) => {
  let {most, least} = props.balance
  let total = props.balances.reduce((v, c) => v + c.value, 0)

  return (
    <Card className='balances'>
      <card-header>
        <h3>Balance</h3>
        <div className='actions'>
          <OverlayTrigger placement='bottom' overlay={<Tooltip id='add-token'>Add Custom Token</Tooltip>}>
            <Button onClick={props.openAddToken} >
              <FontAwesome name='plus' />
            </Button>
          </OverlayTrigger>
        </div>
      </card-header>

      <h2>{props.balances
        .reduce((t, c) => t + c.value, 0)
        .toLocaleString(...currencyFormat)}</h2>
      <p>Your portfolio is composed of <code>{props.balance.tokens}</code> tokens.</p>
      <ScrollArea className='tokens-a'>
        <ul className='tokens'>
          {props.balances.sort((a, b) => a.value < b.value).map((b, i) => (
            <li className={`token token-${b.title}`}>
              <Circle percent={b.value / total * 100} strokeWidth='18' strokeColor={altColors[props.balances.length][i]} trailWidth='18' strokeLinecap='square' trailColor='rgba(255,255,255,0.2)' />
              <div className='details'>
                <value-amount>
                  <amount>{b.amount.toLocaleString()}</amount>
                  <value>{b.value.toLocaleString(...currencyFormat)}</value>
                </value-amount>
                <label>{b.title}</label>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      {false && <Balances balances={props.balances} error={props.balanceError} />
    }
      <card-footer>
        {most && <Valuable className='most' value={most.value} title={most.title} />
        }
        {least && <Valuable className='least' value={least.value} title={least.title} />
        }
      </card-footer>
    </Card>
  )
}

const altColors = [
  ['#e41a1c', '#377eb8', '#4daf4a'],
  ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'],
  ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
  ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
  ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
  ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'],
  ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']
]

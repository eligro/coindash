import {balancesDelay} from './delay';

const items = [
    {title: 'BTC', amount: 12, value: '$7221.5'},
    {title: 'ETH', amount: 20, value: '$255.44'},
    {title: 'Augur', amount: 20, value: '$109.8'},
    {title: 'DGD', amount: 10, value: '$121.6'}
]

class BalancesAPI {
    static getData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([...items]);
            }, balancesDelay);
        });
    }
}

export default BalancesAPI;
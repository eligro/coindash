import { ExchangeDataFetcherBase } from './ExchangeDataFetcherBase'
import { ExchangeValuePoint, ExchangeDataPoint, TokenHistoricData } from './ExchangeProvider'

export default class CryptoCompareFetcher  extends ExchangeDataFetcherBase {
	fetch(token, callback, errorCallBack) {
		let parentObj = this;
		this.fetchRaw(token, function(raw, error) {
			parentObj.parseRaw(token, raw, callback);
		});
	}

	fetchRaw(token, callback) {
		let url = "https://min-api.cryptocompare.com/data/histoday?fsym=" + token.symbol + "&tsym=USD&limit=1000";
		fetch(url, {
	      method: 'get',
	    })
	    .then((response) => response.json())
	    .then((data) => {
	      if (data.Response === "Success") {
	      	callback(data.Data, null);
	      }
	      else {
	      	callback(null, data);
	      }
	      
	    })
	    .catch((error) => {
	      console.error(error);
	    })
	}

	parseRaw(token, raw, callback) {
		if (!raw) {
			callback(new TokenHistoricData(token, []))
			return;
		};

		let history = raw;
		let dataPoints = []
		for (let date in history) {
			let data = history[date];

			let change1H = null;//this.dicToValueArray(data.change1h);
			let change7H = null;//this.dicToValueArray(data.change7h);
			let change7D = null;//this.dicToValueArray(data.change7d);

			let marketCap = null;//this.dicToValueArray(data.marketCap);

			let price = [new ExchangeValuePoint("usd", data.close)];

			let volume24H = null;//this.dicToValueArray(data.volume24);

			let timestamp = data.time;

			let dataPoint = new ExchangeDataPoint(timestamp, 
													price,
													marketCap,
													volume24H,
													change1H,
													change7H,
													change7D);

			dataPoints.push(dataPoint);
		}
		
		let historicalData = new TokenHistoricData(token, dataPoints);

		callback(historicalData);
	}

	dicToValueArray(dic) {
		let ret = [];
		for (let key in dic) {
			let value = dic[key];
			ret.push(new ExchangeValuePoint(key, value));
		}

		return ret;
	}
}
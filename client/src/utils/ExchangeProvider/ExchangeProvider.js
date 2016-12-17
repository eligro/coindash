
import { Token } from '../Trades/Token';
import { ExchangeDataFetcherBase } from './ExchangeDataFetcherBase';
import CoinMarketCapFetcher from './CoinmarketCapFetcher';
import BigNumber from 'bignumber.js';

export class ExchangeValuePoint {
	constructor(currency, value) {
		this.currency = currency;
		this.value = value;
	}
}

export class ExchangeDataPoint {
	constructor(timestamp, price, marketCap, volume24H, change1H, change7H, change7D) {
		this.timestamp = timestamp;
		this.price = price;
		this.marketCap = marketCap;
		this.volume24H = volume24H;
		this.change1H = change1H;
		this.change7H = change7H;
		this.change7D = change7D;
	}

	priceForCurrency(currency) {
		return this.valueForKey(this.price, currency);
	}

	volumeForCurrency(currency) {
		return this.valueForKey(this.volume24H, currency);
	}

	capForCurrency(currency) {
		return this.valueForKey(this.marketCap, currency);
	}

	valueForKey(array, currency) {
		for(var p in array) {
			if (p.currency === currency) {
				return p.value;
			}
		}

		return null;
	}
}

export class TokenHistoricData {
	constructor(token, dataPoints) {
		this.token = token;
		this.dataPoints = dataPoints.sort(this.sortByData);
	}

	sortByData(a, b) {
		if (a.timestamp < b.timestamp) return -1;
		if (a.timestamp > b.timestamp) return 1;

		return 0;
	}
}

export const FiatUSD = "USD";
export const BTC = "BTC";
export const ETH = "ETH";

export class ExchangeProvider {
	static coinMarketCapProvider() {
		return new ExchangeProvider(new CoinMarketCapFetcher());
	}

	constructor(fetcher) {
		this.fetcher = fetcher;
		this.cachedData = {};
	}

	valueForDays(days, callback) {
		this.aggregateDays(days, 0, callback);
	}

	aggregateDays(days, idx, callback) {
		if (days.length == idx) {
			callback(days);
		} else {
			var currentDay = days[idx];
			let parentObj = this;
			
	      	this.valueForDay(currentDay, "usd", function(value) {
		        currentDay["dayFiatValue"] = value;

		        parentObj.valueForDaysDeposits(currentDay, "usd", function(value) {
		        	currentDay["depositsFiatValue"] = value;

		        	parentObj.valueForDaysWithdrawals(currentDay, "usd", function(value) {
			        	currentDay["withdrawalsFiatValue"] = value;

			        	return parentObj.aggregateDays(days, idx + 1, callback);
			        });
		        });		        
	      	});
		}
	}	

	valueForDay(day, targetCurrency, callback) {
		this.aggregateTokens(day.balances, day.timestamp, 0, 0, targetCurrency, callback);
	}

	valueForDaysDeposits(day, targetCurrency, callback) {
		let allTokens = [];
		for (let i in day.deposits) {
			let deposit = day.deposits[i];
			let depoToken = deposit.token;

			let exists = function(token) {
			  	return depoToken.symbol === token.symbol;
			};
			let t = allTokens.find(exists);
			if (t == null) {
				let t = depoToken.copy();
				t.balance = new BigNumber(deposit.amount);
				allTokens.push(t);
			}
			else {
				t.addToBalance(new BigNumber(deposit.amount));
			}
		}
		this.aggregateTokens(allTokens, day.timestamp, 0, 0, targetCurrency, callback);
	}

	valueForDaysWithdrawals(day, targetCurrency, callback) {
		let allTokens = [];
		for (let i in day.withdrawals) {
			let deposit = day.withdrawals[i];
			let depoToken = deposit.token;

			let exists = function(token) {
			  	return depoToken.symbol === token.symbol;
			};
			let t = allTokens.find(exists);
			if (t == null) {
				let t = depoToken.copy();
				t.balance = new BigNumber(deposit.amount);
				allTokens.push(t);
			}
			else {
				t.addToBalance(new BigNumber(deposit.amount));
			}
		}

		this.aggregateTokens(allTokens, day.timestamp, 0, 0, targetCurrency, callback);
	}

	aggregateTokens(tokens, timestamp, count, totalValue, targetCurrency, callback) {
		if (tokens.length == count) {
			callback(totalValue);
			return;
		}

		// //TODO: handle unseporrted tokens
		// if (tokens[count].symbol == "MKR" || tokens[count].symbol == "🦄 Unicorn" || tokens[count].symbol == "🍺 BeerCoin" || tokens[count].symbol == "HKG" || tokens[count].symbol == "GNT (Golem)") {
		// 	console.log("token without history - hard coded");
		// 	console.log(tokens[count].symbol);
		// 	return this.aggregateTokens(tokens, timestamp, ++count, totalValue, targetCurrency, callback);
		// }

		let parentObj = this;

		this.fetchHistoricalDataForToken(tokens[count], function(historicalData){
			let targetDate = new Date(timestamp*1000);

			var isSameDate = function(dataPoint) {
				let d1 = new Date(dataPoint.timestamp * 1000);
			  	return d1.getYear() == targetDate.getYear() &&
			  			d1.getMonth() == targetDate.getMonth() &&
			  			d1.getDate() == targetDate.getDate();
			};
			var dataPoint = historicalData.dataPoints.find(isSameDate)

			if (dataPoint == undefined) { // no data point
				console.log("no data point");
				return parentObj.aggregateTokens(tokens, timestamp, ++count, totalValue, targetCurrency, callback);
			}
			

			var isSameCurrensy = function(exchangeValuePoint) {
			  	return exchangeValuePoint.currency.toUpperCase() == targetCurrency.toUpperCase();
			};
			var exchangeValuePoint = dataPoint.price.find(isSameCurrensy)

        	let currentValue = tokens[count].balance == 0 ? 0 : tokens[count].balance.times(exchangeValuePoint.value).toNumber();

        	return parentObj.aggregateTokens(tokens, timestamp, ++count, totalValue+currentValue, targetCurrency, callback);
  		}, function(error){
			console.log("token without history");
			console.log(tokens[count].symbol);
  			return this.aggregateTokens(tokens, timestamp, ++count, totalValue, targetCurrency, callback);
  		});
	}



	fetchHistoricalDataForToken(token, callback, errorCallBack) {
		let cached = this.cachedData[token.symbol];
		if (!cached) {
			let parentObj = this;
			this.fetcher.fetch(token, function(historicalData) {
				parentObj.cachedData[token.symbol] = historicalData;
				callback(historicalData);
			}, errorCallBack);
		}
		else {
			callback(cached);
		}
	}
}
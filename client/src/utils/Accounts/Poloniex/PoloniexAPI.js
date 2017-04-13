import crypto from 'crypto-js'
import { AjaxUtils } from '../../utils/AjaxUtils';
import poloniexJson from './pt.json'

const version         = '0.0.6';
const PUBLIC_API_URL  = 'https://poloniex.com/public';
const PRIVATE_API_URL = 'https://poloniex.com/tradingApi';
const USER_AGENT      = 'poloniex.js ' + version;

export class PoloniexAPI {
	constructor(secret, api_key) {  
	    this.secret = secret;
	    this.api_key = api_key;
	}

	getHeaderSig(paramString) {
		if (!this.api_key || !this.secret) {
            throw 'Poloniex: Error. API key and secret required';
        }
        return crypto.HmacSHA512(paramString, this.secret).toString(crypto.enc.Hex);
	}

	getURIParams(command, parameters) {
		parameters = {};
		parameters.nonce = Math.floor(Date.now() * 1000);
		parameters.start = "1200070400";
		parameters.end = new Date().getTime()/1000;
		parameters.command = command;
		if (command === "returnTradeHistory") {
			parameters.currencyPair="all"
		}

		return AjaxUtils.queryParams(parameters);
	}

	userAgent() {
		return USER_AGENT;
	}

	makeAuthenticatedCall(command, parameters, callback) {
		let data = this.getURIParams(command, parameters);
		let sig = this.getHeaderSig(data);

		let parentObj = this;
		this.fetchAPIReq(PRIVATE_API_URL, 
			{
	      	"Content-Type": "application/x-www-form-urlencoded",
	      	"Sign": sig,
	      	"Key": this.api_key,
	      	},
	      	data, 
	      	function(data, error) {
	      		if (error == null) {
	      			callback(data, null);
	      		}
	      		else {
	      			callback(null, error);
	      		}
	      	});
	}

	fetchAPIReq(url, headers, data, callback) {
       fetch(PRIVATE_API_URL, {
	      method: 'post',
	      headers: headers,
	      body: data,
	      dataType: "json",
	    })
	    .then((response) => response.json())
	    .then((data) => {
	      callback(data, null);
	    })
	    .catch((error) => {
	      console.log(error);
	      callback(null, error);
	      // alert("Some problems with the account, try again later");
	    });
	}

	// API
	fetchAllTradeHistory(callback) {
		let params = {'currencyPair': 'all'};
		let command = "returnTradeHistory";
		this.makeAuthenticatedCall(command, params, callback);
	}

	fetchWithdrawlAndDepositHistory(callback) {
		let params = {};
		let command = "returnDepositsWithdrawals";
		this.makeAuthenticatedCall(command, params, callback);
	}

	fetchBalances(callback) {
		let params = {};
		let command = "returnBalances";
		this.makeAuthenticatedCall(command, params, callback);
	}
}
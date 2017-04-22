import { GetTask } from '../Networking/GetTask'
import { Token } from '../Trades/Token'

export class CryptoCompareGetTask extends GetTask {
	static fetchRawTask(token) {
		let url = "https://min-api.cryptocompare.com/data/histoday?fsym=" + token.symbol + "&tsym=USD&limit=1000";

	    return new CryptoCompareGetTask(url);
	}

	// instance functions
	postFetchingResponseTransformation(response) {
		return response.json();
	}

	validateResponse(response) {
		return response.Response === "Success";
	}
}
export class Utils {
	static sortTrades(trades) {
		trades.sort(function(a, b) {
			// newest to oldest
		    return b.timestamp - a.timestamp;
		});
		return trades;
	}

	static concatArrayOfArrays(arrOfArrays) {
		let ret = null;
	    for (let k in arrOfArrays) {
	        let arr = arrOfArrays[k];
	        if (ret == null) {
	          ret = arr;
	        }
	        else {
	          ret = ret.concat(arr);
	        }
	    }

	    return ret;
	}
}
export class StatisticsProvider {

	static provider() {
		return new StatisticsProvider();
	}

	constructor() {
        this.jStat = require('jStat').jStat;
    }

    variance(numbers) {
    	return this.jStat.variance(numbers);
    }

    median(numbers) {
    	return this.jStat.median(numbers);
    }
}

import { NetworkTask } from './NetworkTask'

let _instance = null;
export class Networker {

	static instance() {
		if (_instance == null) {
			_instance = new Networker();
		} 

		return _instance;
	}

	constructor() {
		this.tasks = [];
	}

	start(task) {
		this.tasks.push(task);
		return fetch(task.url, {
	    	method: task.method
	    });
	}
}
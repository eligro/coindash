
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
		this.generalFaliure = false;
	}

	setProgressCallback(callback) {
		this.progressCallback = callback;
	}

	startNewTaskSequence() {
		this.generalFaliure = false;
		return this;
	}

	start(task) {
		if (this.generalFaliure) {
			return new Promise(function(resolve, reject) {
		        reject("General faliure");
		    });
		}

		this.tasks.push(task);

		this.fireTaskCountChanged()

		let parentObj = this;

		return new Promise(function(resolve, reject) {
	        fetch(task.url, {
		    	method: task.method
		    })
		    .then((response) => task.postFetchingResponseTransformation(response))
	        .then((data) => {
	        	task.completed = true;

	        	if (parentObj.generalFaliure == false) { // process only if no fatal faliure
	        		parentObj.fireTaskCountChanged();

	        		if (task.validateResponse(data) == false) {
		        		parentObj.generalFaliure = true;
		        		parentObj.fireGeneralError(task.getError(data));
		        		reject(task.getError(data));
		        	}
		        	else {
		        		resolve(data);
		        	}
	        	}
	        	else {
	        		console.log("general error: not processing responses");
	        	}
		    })
		    .catch((error) => {
		    	if (parentObj.generalFaliure == false) {
		    		parentObj.generalFaliure = true;
		    		parentObj.fireGeneralError(error);
		    	}
		        reject(error);
		    })
	    });
	}

	fireTaskCountChanged() {
		if (this.progressCallback) {
			this.progressCallback({
				'progress': (this.completedTasks().length / this.tasks.length),
				'error' : null
			});
		}
	}

	fireGeneralError(error) {
		if (this.progressCallback) {
			this.progressCallback({
				'progress': (this.completedTasks().length / this.tasks.length),
				'error' : error
			});
		}
	}

	completedTasks() {
		let isCompleted = function(task) {
				return task.completed;
		};
		return this.tasks.filter(isCompleted)
	}

	uncompletedTasks() {
		let isNotCompleted = function(task) {
				return task.completed == false;
		};
		return this.tasks.filter(isNotCompleted)
	}
}
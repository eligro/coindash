
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
	        .then((response) => {
	        	task.completed = true;
	        	if (parentObj.generalFaliure == false) {
	        		parentObj.fireTaskCountChanged();
			        resolve(response);
	        	}
	        	else {
	        		reject("general faliure");
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

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

	setProgressCallback(callback) {
		this.progressCallback = callback;
	}

	start(task) {
		this.tasks.push(task);

		this.fireTaskCountChanged()

		let parentObj = this;

		return new Promise(function(resolve, reject) {
	        fetch(task.url, {
		    	method: task.method
		    })
	        .then((response) => {
	        	task.completed = true;
	        	parentObj.fireTaskCountChanged();
		        resolve(response);
		    })
		    .catch((error) => {
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
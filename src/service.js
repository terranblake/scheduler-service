const moment = require('moment');

const { Queue } = require('@postilion/event-framework');

const schedules = require('./schedules');

(async function () {
	for (let schedule of schedules) {
		const { model, query, queue } = schedule;
		
		const scheduleQueue = new Queue(queue);
		const documents = await model.find(query).lean();

		for (let document of documents) {
			scheduleQueue.add(document);
		}
	}
})();
const { Queue } = require('@postilion/event-framework');
const { logger } = require('@postilion/utils');

const schedules = require('./schedules');

async function createJobsFromSchedules() {
	for (let schedule of schedules) {
		const { name, model, query, queue } = schedule;
		logger.info(`creating schedule ${name} for model ${model.modelName} for queue ${queue} using query`, query);

		const scheduleQueue = new Queue(queue);
		scheduleQueue.on('completed', function (job, result) {
			logger.info(`job completed from ${name}`);
		});

		scheduleQueue.on('failed', function (job, result) {
			logger.info(`job failed from ${name}`);
		});

		const documents = await model.find(query);
		logger.info(documents);
		logger.info(`creating ${documents.length} jobs for schedule ${name} for model ${model.modelName} for queue ${queue}`);

		for (let document of documents) {
			scheduleQueue.add(document);
		}
	}
}

createJobsFromSchedules()
const { Queue } = require('@postilion/pubsub');
const { logger } = require('@postilion/utils');

const schedules = require('./schedules');

async function createJobsFromSchedules() {
	for (let schedule of schedules) {
		const { model, query, queue } = schedule;

		const scheduleQueue = new Queue(queue);

		const documents = await model.find(query);
		logger.info(`creating ${documents.length} jobs for queue ${queue} for model ${model.modelName}`);

		for (let document of documents) {
			scheduleQueue.add(document);
		}
	}
}

createJobsFromSchedules()
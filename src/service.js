const { Queue } = require('@postilion/pubsub');
const { logger } = require('@postilion/utils');

const schedules = require('./schedules');

async function createJobsFromSchedules() {
	for (let schedule of schedules) {
		const { model, query, queue, action } = schedule;

		const scheduleQueue = new Queue(queue);

		const documents = await model.find(query);
		logger.info(`found ${documents.length} jobs for ${queue} for model ${model.modelName}`);

		for (let document of documents) {
			if (!action) {
				scheduleQueue.add(document);
			} else {
				await handleScheduledAction(model, document, action);
			}
		}
	}
}

async function handleScheduledAction(model, document, { type, data }) {
	switch (type) {
		case 'update':
			await model.findOneAndUpdate({ _id: document._id }, data);
			break;
		default:
			throw new Error(`the action type ${type} is not supported. please use a different action type`);
			break;
	}
}

createJobsFromSchedules()
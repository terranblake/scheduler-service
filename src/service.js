const { Queue } = require('@postilion/pubsub');
const { logger } = require('@postilion/utils');

const { second } = require('./utils/units-of-time');
const { recurringJobs, scheduledEvents } = require('./schedules');

async function createRecurringJobs() {
	for (let schedule of recurringJobs) {
		const { model, query, queue } = schedule;

		const scheduleQueue = new Queue(queue);

		const documents = await model.find(query);
		logger.info(`found ${documents.length} recurring jobs for ${queue} for model ${model.modelName}`);

		for (let document of documents) {
			scheduleQueue.add(document);
		}
	}
}

async function createScheduledEvents() {
	for (let schedule of scheduledEvents) {
		const { model, query, queue, action } = schedule;

		const documents = await model.find(query);
		logger.info(`found ${documents.length} scheduled events for ${queue} with action type ${action.type} for model ${model.modelName}`);

		for (let document of documents) {
			switch (action.type) {
				case 'update':
					await model.findOneAndUpdate({ _id: document._id }, action.data);
					break;
				default:
					throw new Error(`the action type ${action.type} is not supported. please use a different action type`);
					break;
			}
		}
	}

	loop();
}

function loop() {
	setTimeout(() => {
		createScheduledEvents();
	}, second * 15)
}

createScheduledEvents()
createRecurringJobs()
const moment = require('moment');

const models = require('@postilion/models');
const { second } = require('../utils/units-of-time');

module.exports = [
	{
		// todo: split queues by priority to allow separate instances of the
		// scheduler service to handle the priorities with different importance
		queue: 'ScheduledEvents',
		model: models.Event,
		query: {
			// make sure this is a scheduled event
			date: {
				$exists: true
			},
			// make sure that the event hasn't already been scheduled
			scheduledAt: undefined,
			// we want to look at events that were supposed to be scheduled
			// that we might have missed or events in the near future that need to be processed
			// with priority going to events that are happening in the future because we don't
			// want to fall behind. other instances of the scheduler service can handle catching
			// up with jobs that for some reason weren't handled correctly or are taking a long
			// time to schedule and get to the correct queue in a timely manner
			$or: [
				{
					date: {
						// subtract a few seconds to make sure that all events are being processed
						$gt: moment().subtract(15, 'second').toDate()
					}
				},
				{
					date: {
						// add a minute to schedule a few jobs early
						$lt: moment().add(1, 'minute').toDate()
					}
				}
			]
		},
		action: {
			// update every matched Event to have a scheduledAt of rfn
			// which should trigger a change stream update which will allow
			// all services to listen for when an Event with a specific set
			// of fields has been triggered and needs to be processed
			type: 'update',
			data: {
				scheduledAt: moment()
			}
		},
		options: {
			repeat: {
				every: second * 15,
				limit: 10000
			}
		}
	},
]
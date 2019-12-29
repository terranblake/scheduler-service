const moment = require('moment');

const models = require('@postilion/models');
const { hour, day } = require('../utils/units-of-time');

module.exports = [
	{
		// keep filings updated by finding all companies
		// who were last synced more than 30 minutes ago
		queue: 'SyncFilingsByTicker',
		model: models.Company,
		query: {
			// we want all companies who haven't been synced in the
			// past 30 minutes or haven't been synced EVER
			$or: [
				{
					'stats.lastSyncedFilingsAt': {
						$lt: moment().subtract(30, 'minute').toDate()
					}
				},
				{
					'stats.lastSyncedFilingsAt': null
				}
			]
		},
		options: {
			repeat: {
				every: hour,
				limit: 1000
			}
		}
	},
	{
		// keep earnings calendar up-to-date with integrations
		// to ensure that we are fetching filings as soon as
		// they are published and are downloadable
		queue: 'SyncCompanyEarningsEvents',
		model: models.Company,
		query: {
			// we want all companies who haven't been synced in the
			// past 1 day or haven't been synced EVER
			$or: [
				{
					'stats.lastSyncedEarningsAt': {
						$lt: moment().subtract(1, 'days').toDate()
					}
				},
				{
					'stats.lastSyncedEarningsAt': null
				}
			]
		},
		options: {
			repeat: {
				every: day,
				limit: 1000
			}
		}
	}
]
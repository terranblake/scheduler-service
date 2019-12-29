const moment = require('moment');

const models = require('@postilion/models');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

module.exports = [
	{
		// keep filings updated by finding all companies
		// who were last synced more than 30 minutes ago
		queue: 'SyncFilingsByTicker',
		model: models.Company,
		query: {
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
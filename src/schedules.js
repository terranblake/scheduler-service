const moment = require('moment');

const models = require('@postilion/models');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;

module.exports = [
	{
		// keep filings updated by finding all companies
		// who were last synced at least 30 minutes ago
		name: 'SyncAllCompanyFilings',
		queue: 'SyncFilingsByTicker',
		model: models.Company,
		query: {
			'stats.lastSyncedFilingsAt': {
				$lt: moment().subtract(30, 'minute').toDate()
			}
		},
		options: {
			repeat: {
				every: hour,
				limit: 1000
			}
		}
	}
]
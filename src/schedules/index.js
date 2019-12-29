module.exports = {
	scheduledEvents: [
		...require('./events')
	],
	recurringJobs: [
		...require('./sync')
	]
}
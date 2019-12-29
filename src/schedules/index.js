// combines exported Array<Schedule> from each file in this directory

const events = require('./events');
const sync = require('./sync');

module.exports = [
	...events,
	...sync
]